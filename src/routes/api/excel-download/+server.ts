import { type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";
import { OPEN_API_KEY } from "$env/static/private";
import ExcelJS from "exceljs";

const openai = new OpenAI({ apiKey: OPEN_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { extractedTexts } = await request.json();

    if (!extractedTexts || typeof extractedTexts !== "object") {
      return new Response(
        JSON.stringify({ error: "No extracted texts provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Map each file to a Promise for parallel processing
    const processingPromises = Object.entries(extractedTexts).map(
      async ([fileName, extractedText]) => {
        if (!extractedText) {
          return { fileName, excelFile: null };
        }

        try {
          // Query OpenAI for structured data
          const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert in extracting structured data from text. Given a document, you will return structured JSON adhering to a specific format.",
              },
              {
                role: "user",
                content: `Extract the following structured data from the provided document and return it in JSON format. The structure must adapt to the specific content of the file but adhere to the following hierarchy consistently:\n\n1. **Activity**: Extract the activity type indicated (e.g., \"Rollover Fee Accrual\").\n\n2. **Issuer**: Extract the issuer's name.\n\n3. **Facility**: Extract the facility name.\n\n4. **Sections**: Identify and extract all sections, regardless of their names (e.g., \"Affected Contracts\", \"Payment Information\", \"Resulting Contracts\", \"New Contracts\"). Each section should include:\n\n    - **Section Name**: The title of the section (e.g., \"Affected Contracts\").\n\n    - **Contracts**: Extract all contracts within the section. For each contract:\n        - **Contract Name**: The name or description of the contract (e.g., \"Manual Basis Fee Accrual Contract : PIK (Exp. 12/13/24)\").\n        - **Details**: Extract all key-value pairs associated with the contract, such as:\n            - \"Principal Amount\", \"Global Amount\", \"Start\", \"Next Pay\", \"Maturity\", \"Basis\", \"All-In-Rate\", \"Base Rate\", \"Spread\", etc..\n            - **Interest Information**: Extract all key-value pairs located in the box immediately below the section. Anything starting with "Paid on" should be included in the Section named "Payment Information" if it exists. such as:\n        - \"Paid on 12/13/2024 (USD)\",\n        - \"Fees accrued to 12/13/2024 (USD)\",\n        - \"Capitalized interest (USD)\",\n        - \"Projected interest (USD).\"\n      Associate this information **once with the section** and not with individual contracts.\n\nHere is the document text:\n\n${extractedText}`,
              },
            ],
            temperature: 0.0,
            max_tokens: 3000,
          });

          const documentJSONString = response.choices[0]?.message?.content
            ?.replace(/```json|```/g, "")
            .trim();

          if (!documentJSONString) {
            throw new Error("OpenAI returned an empty or invalid response.");
          }

          const documentJSON = JSON.parse(documentJSONString);

          // Generate Excel file
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Loan Activity");

          // Styles
          const headerStyle = { bold: true, size: 14 };
          const sectionStyle = { bold: true, size: 12 };
          const contractStyle = { bold: true, size: 11 };

          // Add top-level fields
          worksheet.addRow([`Activity: ${documentJSON.Activity}`]).font =
            headerStyle;
          worksheet.addRow([`Issuer: ${documentJSON.Issuer}`]).font =
            headerStyle;
          worksheet.addRow([`Facility: ${documentJSON.Facility}`]).font =
            headerStyle;
          worksheet.addRow([]); // Empty row

          // Process Sections
          documentJSON.Sections.forEach((section: any) => {
            worksheet.addRow([section["Section Name"]]).font = sectionStyle;

            if (Array.isArray(section.Contracts)) {
              section.Contracts.forEach((contract: any) => {
                worksheet.addRow(["", contract["Contract Name"]]).font =
                  contractStyle;

                // Process Details with Keys in One Row and Values in the Next
                if (contract.Details && typeof contract.Details === "object") {
                  const keys = Object.keys(contract.Details);
                  const values = Object.values(contract.Details);
                  worksheet.addRow(["", ...keys]).font = contractStyle; // Keys row
                  worksheet.addRow(["", ...values]); // Values row
                } else {
                  worksheet.addRow(["", "No details available"]);
                }
              });
            } else {
              worksheet.addRow(["", "No contracts available"]);
            }

            // Add Interest Information
            if (section["Interest Information"]) {
              worksheet.addRow(["Interest Information:"]).font = contractStyle;

              const interestKeys = Object.keys(section["Interest Information"]);
              const interestValues = Object.values(
                section["Interest Information"]
              );

              // Add Keys and Values
              worksheet.addRow(["", ...interestKeys]).font = sectionStyle; // Keys row
              worksheet.addRow(["", ...interestValues]); // Values row
            }

            worksheet.addRow([]); // Space between sections
          });

          // Write workbook to buffer
          const buffer = await workbook.xlsx.writeBuffer();
          const downloadUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${Buffer.from(
            buffer
          ).toString("base64")}`;

          return { fileName, excelFile: downloadUrl };
        } catch (error) {
          console.error(`Error processing file: ${fileName}`, error);
          return { fileName, excelFile: null };
        }
      }
    );

    // Process all files in parallel
    const results = await Promise.all(processingPromises);

    // Combine results into a response
    const excelFiles = results.reduce((acc, { fileName, excelFile }) => {
      if (excelFile) {
        acc[fileName] = excelFile;
      }
      return acc;
    }, {} as Record<string, string>);

    return new Response(JSON.stringify(excelFiles), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
