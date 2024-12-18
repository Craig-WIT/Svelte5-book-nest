import ExcelJS from 'exceljs';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET() {
    // Example JSON data (replace this with dynamic data fetching)
    const dataArray = [
        {
          "activity": "Process Receivable",
          "issuer": "Eppinger Technologies, LLC",
          "facility": "Revolver",
          "sections": [
            {
              "section_name": "Receive Underpayment",
              "interest_info": {
                "Paid on 12/13/2024 (USD)": "8.70"
              },
              "contracts": [
                {
                  "contract_name": "Contract: 3-MO term SOFR (Exp. 09/13/24)",
                  "details": {}
                }
              ]
            }
          ]
        },
        {
          "activity": "Rollover Fee Accrual",
          "issuer": "Eppinger Technologies, LLC",
          "facility": "Revolver",
          "sections": [
            {
              "section_name": "Affected Contracts",
              "contracts": [
                {
                  "contract_name": "Manual Basis Fee Accrual Contract : PIK (Exp. 12/13/24) (USD)",
                  "details": {
                    "Principal Amount": "25,111.71",
                    "Global Amount": "0.00",
                    "Start": "9/13/2024",
                    "Next Pay": "12/13/2024",
                    "Maturity": "12/13/2024",
                    "Basis": "ACT/360",
                    "All-In-Rate": "1.50000%",
                    "Base Rate": "0.00000%",
                    "Spread": "1.50000%"
                  }
                },
                {
                  "contract_name": "Contract : 3-MO term SOFR (Exp. 3/13/25) (USD) (CME Term SOFR) (Term/2)",
                  "details": {
                    "Principal Amount": "25,111.71",
                    "Global Amount": "762,889.18",
                    "Start": "12/13/2024",
                    "Next Pay": "3/13/2025",
                    "Maturity": "3/13/2025",
                    "Basis": "ACT/360",
                    "All-In-Rate": "11.79545%",
                    "Base Rate": "4.39545%",
                    "Spread": "7.25000%"
                  }
                }
              ]
            },
            {
              "section_name": "Payment Information",
              "interest_info": {
                "Fees Accrued to 12/13/2024 (USD)": "95.22",
                "Capitalized Interest (USD)": "-95.22",
                "Received Fees (USD)": "0.00"
              },
              "contracts": [
                {
                  "contract_name": "Manual Basis Fee Accrual Contract : PIK (Exp. 12/13/24) (USD)",
                  "details": {
                    "Principal Amount": "25,111.71",
                    "Global Amount": "0.00",
                    "FX Rate": "1.00000",
                    "Accrual Period": "9/13/2024 - 12/13/2024",
                    "Days/Basis": "91/360",
                    "All-In-Rate": "1.50000%",
                    "Spread": "1.50000%",
                    "Accrued Fee": "95.22"
                  }
                }
              ]
            },
            {
              "section_name": "Resulting Contracts",
              "interest_info": {
                "Projected Interest (USD)": "837.85"
              },
              "contracts": [
                {
                  "contract_name": "Contract : 3-MO term SOFR (Exp. 3/13/25) (USD) (CME Term SOFR) (Term/2)",
                  "details": {
                    "Principal Amount": "25,206.93",
                    "Global Amount": "765,781.80",
                    "Start": "12/13/2024",
                    "Next Pay": "3/13/2025",
                    "Maturity": "3/13/2025",
                    "Basis": "ACT/360",
                    "All-In-Rate": "11.79545%",
                    "Base Rate": "4.39545%",
                    "Spread": "7.25000%"
                  }
                },
                {
                  "contract_name": "Manual Basis Fee Accrual Contract : PIK (Exp. 3/13/25) (USD)",
                  "details": {
                    "Principal Amount": "25,206.93",
                    "Global Amount": "0.00",
                    "Start": "12/13/2024",
                    "Next Pay": "3/13/2025",
                    "Maturity": "3/13/2025",
                    "Basis": "ACT/360",
                    "All-In-Rate": "1.50000%",
                    "Base Rate": "0.00000%",
                    "Spread": "1.50000%"
                  }
                }
              ]
            }
          ]
        },
        {
          "activity": "Rollover",
          "issuer": "Eppinger Technologies, LLC",
          "facility": "Revolver",
          "sections": [
            {
              "section_name": "Rollover Contract",
              "contracts": [
                {
                  "contract_name": "Contract : 3-MO term SOFR (Exp. 12/13/24) (USD) (CME Term SOFR) (Term/2)",
                  "details": {
                    "Principal Amount": "25,111.71",
                    "Global Amount": "762,889.18",
                    "Start": "9/13/2024",
                    "Next Pay": "12/13/2024",
                    "Maturity": "12/13/2024",
                    "Basis": "ACT/360",
                    "All-In-Rate": "12.33129%",
                    "Base Rate": "4.93129%",
                    "Spread": "7.25000%"
                  }
                }
              ]
            },
            {
              "section_name": "Payment Information",
              "interest_info": {
                "Paid on 12/13/2024 (USD)": "782.75"
              },
              "contracts": [
                {
                  "contract_name": "Contract : 3-MO term SOFR (Exp. 12/13/24) (USD) (CME Term SOFR) (Term/2)",
                  "details": {
                    "Principal Amount": "25,111.71",
                    "Global Amount": "762,889.18",
                    "FX Rate": "1.00000",
                    "Accrual Period": "9/13/2024 - 12/13/2024",
                    "Base Rate": "4.93129%",
                    "Spread": "7.25000%",
                    "Interest From Base Rate": "313.02",
                    "Interest From Spread": "460.21",
                    "Interest From Spread Adjustment": "9.52"
                  }
                }
              ]
            },
            {
              "section_name": "New Contracts",
              "interest_info": {
                "Projected Interest (USD)": "740.51"
              },
              "contracts": [
                {
                  "contract_name": "Contract : 3-MO term SOFR (Exp. 3/13/25) (USD) (CME Term SOFR) (Term/2)",
                  "details": {
                    "Principal Amount": "25,206.93",
                    "Global Amount": "765,781.80",
                    "Start": "12/13/2024",
                    "Next Pay": "3/13/2025",
                    "Maturity": "3/13/2025",
                    "Basis": "ACT/360",
                    "All-In-Rate": "11.79545%",
                    "Base Rate": "4.39545%",
                    "Spread": "7.25000%"
                  }
                }
              ]
            }
          ]
        }
      ];

      const workbook = new ExcelJS.Workbook();

      // Process each activity
      dataArray.forEach((activity, index) => {
          const worksheet = workbook.addWorksheet(`Activity ${index + 1}`);
  
          // Add headers
          worksheet.addRow([`Activity: ${activity.activity}`]);
          worksheet.addRow([`Issuer: ${activity.issuer}`]);
          worksheet.addRow([`Facility: ${activity.facility}`]);
          worksheet.addRow([]); // Blank row
  
          // Style the headers
          worksheet.getRow(1).font = { bold: true, size: 16 };
          worksheet.getRow(2).font = { bold: true, size: 14 };
          worksheet.getRow(3).font = { bold: true, size: 14 };
  
          // Process sections
          activity.sections.forEach((section) => {
              // Add section name
              const sectionRow = worksheet.addRow([section.section_name]);
              sectionRow.font = { bold: true, underline: true, size: 14 };
  
              // Add contracts
              section.contracts.forEach((contract) => {
                  const contractRow = worksheet.addRow([contract.contract_name]);
                  contractRow.font = { bold: true };
  
                  if (Object.keys(contract.details).length > 0) {
                      const headers = Object.keys(contract.details);
                      const values = Object.values(contract.details);
  
                      worksheet.addRow(headers); // Add detail headers
                      worksheet.addRow(values); // Add detail values
                  } else {
                      worksheet.addRow(["No details available"]);
                  }
              });
  
              // Add interest information
              if (section.interest_info) {
                  worksheet.addRow([]);
                  worksheet.addRow(["Interest Information"]);
                  Object.entries(section.interest_info).forEach(([key, value]) => {
                      worksheet.addRow([key, value]);
                  });
              }
  
              worksheet.addRow([]); // Blank row after each section
          });
      });
  
      // Write the workbook to a buffer
      const buffer = await workbook.xlsx.writeBuffer();
  
      // Return the Excel file for download
      return new Response(buffer, {
          headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'Content-Disposition': 'attachment; filename="loan_activities.xlsx"'
          }
      });
  }