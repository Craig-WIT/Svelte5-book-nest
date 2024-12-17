<script lang="ts">
  import Button from "$components/Button.svelte";
  import StarRating from "$components/StarRating.svelte";
  import { getUserState, type Book } from "$lib/state/user-state.svelte";
  import Icon from "@iconify/svelte";
  import Dropzone from "svelte-file-dropzone";

  interface bookPageProps {
    data: {
      book: Book;
    }
  }

  let {data}: bookPageProps = $props()

  let userContext = getUserState();

  let book = $derived(userContext.getBookById(data.book.id) || data.book);
  let isEditMode = $state(false);
  let title = $state(data.book.title);
  let author = $state(data.book.author);
  let description = $state(data.book.description || "");
  let genre = $state(data.book.genre || "");

  function goBack() {
    history.back();
} 

  async function toggleEditModeAndSaveToDatabase() {
    if (isEditMode) {
      await userContext.updateBook(book.id, {
        title, author, description, genre
      })
    }
    isEditMode = !isEditMode
  }

  async function deleteBookFromDatabase() {
    await userContext.deleteBookById(book.id)
  }

  async function updateDatabaseRating(newRating: number) {
    await userContext.updateBook(book.id, {rating: newRating})
  }

  async function updateReadingStatus() {
    const hasStartedReading = Boolean(book.started_reading_on);
    const currentTimeStamp = new Date().toISOString();

    if(!hasStartedReading) {
      await userContext.updateBook(book.id, {started_reading_on: currentTimeStamp})
    } else {
      await userContext.updateBook(book.id, {finished_reading_on: currentTimeStamp})
    }
  }

  async function handleDrop(e: CustomEvent<any>) {
    const { acceptedFiles } = e.detail;

    if (acceptedFiles.length) {
      const file = acceptedFiles[0] as File;
      await userContext.uploadBookCover(file, book.id)
    }
  }
  
</script>

{#snippet bookInfo()}

<h2 class="book-title mb-m">{book.title}</h2>
<p class="book-author">by {book.author}</p>
<h4 class="mt-m mb-xs semi-bold">Your rating</h4>
<StarRating value={book.rating || 0} isReadOnly={false} {updateDatabaseRating}></StarRating>
<p class="small-font">
  Click to {book.rating ? "change" : "give"} rating
</p>
{#if book.description}
  <h4 class="mt-m mb-xs semi-bold">Description</h4>
  <p class="mb-m">{book.description}</p>
{:else}
<h4 class="mt-m mb-xs semi-bold">No description yet</h4>
<button class="block mb-m" onclick={() => console.log("Toggle edit mode")}>
  <p>Click to add description</p>
</button>
{/if}

{#if !book.finished_reading_on}
  <Button isSecondary={Boolean(book.started_reading_on)} onclick={updateReadingStatus}>
    {book.started_reading_on ? "I finished reading this book" : "I started reading this book"}
  </Button>
{/if}
{#if book.genre}
<h4 class="mt-m mb-xs semi-bold">Genre</h4>
<p>{book.genre}</p>
{/if}
  
{/snippet}

{#snippet editFields()}
  <form>
    <input type="text" class="input input-title mt-m mb-xs" bind:value={title} name="title" />
    <div class="input-author">
      <p>by</p>
      <input type="text" class="input" name="author" bind:value={author} />
    </div>
    <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
    <StarRating value={book.rating || 0} isReadOnly={false} {updateDatabaseRating}></StarRating>
    <p class="small-font">
      Click to {book.rating ? "change" : "give"} rating
    </p>
    <h4 class="mt-m mb-xs semi-bold">Description</h4>
    <textarea name="description" bind:value={description} class="textarea mb-m" placeholder="Give a description"></textarea>
  
    {#if !book.finished_reading_on}
      <Button isSecondary={Boolean(book.started_reading_on)} onclick={updateReadingStatus}>
        {book.started_reading_on ? "I finished reading this book" : "I started reading this book"}
      </Button>
    {/if}
    {#if book.genre}
      <h4 class="mt-m mb-xs semi-bold">Genre</h4>
      <input type="text" class="input" bind:value={genre} name="genre" />
    {/if}

  </form>
{/snippet}

<div class="bookpage">
  <button onclick={goBack} aria-label="Go back">
    <Icon icon="ep:back" width={"40"} />
  </button>
  <div class="book-container">
    <div class="book-info">
      {#if isEditMode}
        {@render editFields()}
      {:else}
        {@render bookInfo()}
      {/if}
      <div class="buttons-container mt-m">
        <Button isSecondary={true} onclick={toggleEditModeAndSaveToDatabase}>{isEditMode ? "Save changes" : "Edit"}</Button>
        <Button isDangerous={true} onclick={deleteBookFromDatabase}>Delete book</Button>
      </div>
    </div>
    <div class="book-cover">
      {#if book.cover_image}
        <img src={book.cover_image} alt="Book cover">
      {:else}
        <Dropzone on:drop={handleDrop} multiple={false} accept="image/*" maxSize={5 * 1024 * 1024} containerClasses={"dropzone-cover"}>
          <Icon class="add-image-icon" icon="bi:camera-fill" width={"40"} />
          <p>Drag a picture or click to select a file</p>
        </Dropzone>
      {/if}
    </div>
  </div>
</div>

<style>
  .book-container {
    display: flex;
    justify-content: flex-start;
  }

  .book-info {
    width: 50%;
  }

  .book-cover {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    border-radius: 15px;
    min-height: 400px;
    max-width: 450px;
    margin-left: 80px;
  }

  .book-cover img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .book-cover .add-cover {
  display: flex;           
  align-items: center;     
  justify-content: center; 
  flex-direction: column;  
  padding: 10px;              
  cursor: pointer;         
}

  .book-cover .add-image-icon {
    margin-bottom: 8px; 
  }

  .input {
    padding: 8px 4px;
    width: 100%;
  }

  .textarea {
    width: 100%;
  }

  .input-title {
    font-size: 60px;
    font-weight: bold;
    font-family: "EB Garamond", serif;
  }

  .input-author {
    display: flex;
    align-items: center;
  }
  .input-author p {
    margin-right: 8px;
  }

  :global(.dropzone-cover) {
    height: 100%;
    border-radius: 15px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    border: unset !important;
    cursor: pointer;
    border-style: solid !important;
    }
</style>