<script lang="ts">
  import Dropzone from "svelte-file-dropzone";
  import Icon from "@iconify/svelte";

  let isLoading = false;
  let errorMessage = "";
  let uploadedFiles: { name: string; status: string }[] = [];

  async function handleDrop(e: CustomEvent<any>) {
    const { acceptedFiles } = e.detail;

    if (acceptedFiles.length) {
      isLoading = true;
      errorMessage = "";
      uploadedFiles = []; // Reset the uploaded files list

      const formData = new FormData();
      acceptedFiles.forEach((file: File) => formData.append("files", file));

      try {
        // Send the PDF files to the Flask backend for text extraction
        const response = await fetch("http://localhost:5000/extract-text", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to extract text from uploaded PDFs.");
        }

        const result = await response.json();
        console.log("Backend response:", result);

        if (result.texts) {
          // Send extracted texts to OpenAI backend for processing
          const openaiResponse = await fetch("/api/excel-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ extractedTexts: result.texts }),
          });

          if (!openaiResponse.ok) {
            throw new Error("Failed to process files with OpenAI.");
          }

          const excelFiles = await openaiResponse.json();
          console.log("OpenAI response:", excelFiles);

          // Automatically download each Excel file
          for (const [fileName, downloadUrl] of Object.entries(excelFiles)) {
            triggerDownload(
              downloadUrl as string,
              fileName.replace(/\.pdf$/, ".xlsx")
            );
          }

          // Populate the uploaded files list with statuses
          uploadedFiles = Object.entries(result.texts).map(([name, text]) => ({
            name,
            status: text ? "Success" : "Failed",
          }));
        } else {
          throw new Error("Unexpected response format from backend.");
        }
      } catch (error) {
        errorMessage = "An error occurred during the upload.";
        console.error(error);
      } finally {
        isLoading = false;
      }
    } else {
      errorMessage = "No valid files were dropped.";
    }
  }

  function triggerDownload(url: string, fileName: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName; // Ensure the file is downloaded as .xlsx
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
</script>

<h2 class="mt-m mb-l">Drop PDFs to Extract Text</h2>
<div class="upload-area">
  <div class="upload-container">
    <h4 class="text-center mb-s upload-error">
      {#if errorMessage}{errorMessage}{/if}
    </h4>
    {#if isLoading}
      <div class="spinner-container">
        <div class="spinner"></div>
        <p>Processing your files...</p>
      </div>
    {:else}
      <Dropzone
        on:drop={handleDrop}
        multiple={true}
        accept="application/pdf"
        maxSize={10 * 1024 * 1024}
        containerClasses={"dropzone-cover"}
      >
        <Icon
          class="add-image-icon"
          icon="bi:file-earmark-pdf-fill"
          width={"40"}
        />
        <p>Drag PDFs or click to select files</p>
      </Dropzone>
    {/if}
    {#if uploadedFiles.length}
      <div class="uploaded-files">
        <h3>File Upload Status:</h3>
        <ul>
          {#each uploadedFiles as file, i}
            <li>
              {i + 1} - {file.name}: <strong>{file.status}</strong>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style>
  .upload-error {
    color: rgb(131, 0, 0);
  }

  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .upload-container {
    width: 600px;
  }

  .spinner-container {
    display: flex;
    align-items: center;
  }

  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: black;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-right: 8px;
    animation: spin 0.5s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .uploaded-files {
    margin-top: 20px;
    text-align: left;
  }

  .uploaded-files ul {
    list-style: none;
    padding: 0;
  }

  .uploaded-files li {
    margin-bottom: 8px;
  }

  .uploaded-files strong {
    color: green;
  }
</style>
