import { type RequestHandler } from "@sveltejs/kit";
import OpenAI from "openai";
import { OPEN_API_KEY } from "$env/static/private";
import * as XLSX from "xlsx";

const openai = new OpenAI({ apiKey: OPEN_API_KEY });

export const GET: RequestHandler = async () => {
  // Hardcoded extracted text for testing
  const extractedText = `
        agentnotices@waystone.com
        KAYNE ANDERSON SENIOR CREDIT FUND, 
        sub-fund of DMS QIAIF CORRIB PLATFORM 
        Phone:
        Fax:
        Email:agentnotices@waystone.comFrom:RUrso Loanco
        KAYNE SENIOR CREDIT III LOANCO LLC - Agent 
        Master
        Phone:
        Fax:
        Email:loanopsteam@kaynecapital.com
        Issuer:Eppinger Technologies, LLC
        MEI:
        Facility:Revolver
        CUSIP:Bank Deal: February 2019
        CUSIP:
        Effective Date:12/13/2024
        Paid on  12/13/2024  (USD):782.75
        Page  1  of  2Activity Memo
        *** Rollover ***
        Rollover Contract :
        Principal AmountGlobal Amount Start  Next Pay Maturity Basis All-In-Rate Base Rate Spread
        Contract : 3-MO term SOFR (Exp. 12/13/24) (USD) (CME Term SOFR) (Term/2) Spread Adj: 0.15000% Basis: ACT/360
        25,111.71 762,889.18 9/13/2024 -12/13/2024 12/13/2024 ACT/360 12.33129% 4.93129% 7.25000%
        Payment Information :
        Principal AmountFX Rate Accrual Period Base Rate Spread Interest From  
        Base RateInterest From  
        SpreadInterest From  
        Spread Adjustment
        Contract : 3-MO term SOFR (Exp. 12/13/24) (USD) (CME Term SOFR) (Term/2) Spread Adj: 0.15000% Basis: ACT/360
        25,111.71 1.00000 9/13/2024 - 12/13/2024 4.93129% 7.25000% 313.02 460.21 9.52
        New Contract(s) :
        Principal AmountGlobal Amount Start  Next Pay Maturity Basis All-In-Rate Base Rate Spread
        Contract : 3-MO term SOFR (Exp. 3/13/25) (USD) (CME Term SOFR) (Term/2) Spread Adj: 0.15000% Basis: ACT/360
        25,111.71 762,889.18 12/13/2024 -3/13/2025 3/13/2025 ACT/360 11.79545% 4.39545% 7.25000%
        Projected Interest  (USD): 740.51
        Notes:
        Produced by  Wall Street Office
        Run date 12/13/2024
        `;

  try {
    //Query OpenAI for structured data
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in extracting structured data from text. Given a document, you will return structured JSON adhering to a specific format.",
        },
        {
          role: "user",
          content: `Extract the following structured data from the provided document and return it in JSON format. The structure must adapt to the specific content of the file but adhere to the following hierarchy consistently:\n\n1. **Activity**: Extract the activity type indicated (e.g., \"Rollover Fee Accrual\").\n\n2. **Issuer**: Extract the issuer's name.\n\n3. **Facility**: Extract the facility name.\n\n4. **Sections**: Identify and extract all sections, regardless of their names (e.g., \"Affected Contracts\", \"Payment Information\", \"Resulting Contracts\", \"New Contracts\"). Each section should include:\n\n    - **Section Name**: The title of the section (e.g., \"Affected Contracts\").\n\n    - **Contracts**: Extract all contracts within the section. For each contract:\n        - **Contract Name**: The name or description of the contract (e.g., \"Manual Basis Fee Accrual Contract : PIK (Exp. 12/13/24)\").\n        - **Details**: Extract all key-value pairs associated with the contract, such as:\n            - **Financial Information**: (\"Principal Amount\", \"Global Amount\", \"Start\", \"Next Pay\", \"Maturity\", \"Basis\", \"All-In-Rate\", \"Base Rate\", \"Spread\", etc.).\n            - **Payment Information Details**: If applicable, include values like \"FX Rate,\" \"Accrual Period,\" \"Interest From Base Rate,\" etc.\n\n    - **Interest Information**: Extract all key-value pairs located in the box immediately below the section, such as:\n        - \"Paid on\",\n        - \"Fees accrued to\",\n        - \"Capitalized interest\",\n        - \"Projected interest.\"\n      Associate this information **once with the section** and not with individual contracts.\n\nHere is the document text:\n\n${extractedText}`,
        },
      ],
      temperature: 0.0,
      max_tokens: 3000,
    });

    //Parse OpenAI response
    const bookArrayString = response.choices[0]?.message?.content
      ?.replace(/```json|```/g, "")
      .trim();

    console.log(
      "This is book array string: " + JSON.stringify(bookArrayString),
    );

    if (!bookArrayString) {
      throw new Error("OpenAI returned an empty or invalid response.");
    }

    const bookArray = JSON.parse(bookArrayString);

    console.log("This is book array: " + JSON.stringify(bookArray));

    // Generate Excel file
    const workbook = XLSX.utils.book_new();
    const worksheetData: any[][] = [];

    // Add top-level fields
    worksheetData.push(["Activity: " + bookArray.Activity]);
    worksheetData.push(["Issuer: " + bookArray.Issuer]);
    worksheetData.push(["Facility: " + bookArray.Facility]);
    worksheetData.push([]);

    console.log(bookArray.Sections);

    // Iterate through sections
    bookArray.Sections.forEach((section: any) => {
      worksheetData.push([section["Section Name"]]);
      worksheetData.push([]);

      // Check if Contracts exists and is an array
      if (Array.isArray(section.Contracts)) {
        section.Contracts.forEach((contract: any) => {
          worksheetData.push(["", contract["Contract Name"]]);

          // Check if contract.details exists and is an object
          if (contract.Details && typeof contract.Details === "object") {
            Object.entries(contract.Details).forEach(([key, details]: any) => {
              worksheetData.push(["", key]); // Add the key as a header row

              // Ensure details is an object
              if (typeof details === "object" && details !== null) {
                Object.entries(details).forEach(([subKey, subValue]: any) => {
                  worksheetData.push(["", "", subKey, subValue]); // Add details
                });
              } else {
                worksheetData.push(["", "", "No additional details"]);
              }
            });
          } else {
            worksheetData.push(["", "No details available"]);
          }
          worksheetData.push([]); // Add spacing between contracts
        });
      } else {
        worksheetData.push(["", "No contracts available"]); // Handle missing or invalid Contracts
      }

      // Add Interest Information if available
      if (section["Interest Information"]) {
        Object.entries(section["Interest Information"]).forEach(
          ([key, value]: any) => {
            worksheetData.push(["", key, value]);
          },
        );
      }

      worksheetData.push([]); // Space between sections
    });

    worksheetData.push([]);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Activity");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Return Excel file as Response
    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="loan_activity.xlsx"',
      },
    });
  } catch (error) {
    // Return an error response
    console.error("Error in GET /api/scan-shelf:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
