<!-- <script lang="ts">
  import { getUserState } from "$lib/state/user-state.svelte";

  let userContext = getUserState();

  console.log("This is userContext" + JSON.stringify(userContext))

  let { allBooks} = $derived(userContext);

</script> -->

<h1 class="dashboard-header">Name</h1>
<!-- {#each allBooks as book}
<ul>
  <li>
    Name
    {book.title}
  </li>
</ul>

{/each} -->

<style>
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }

  .add-book {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .add-book p {
    margin-left: 8px;
  }

  .headline {
    text-align: right;
    max-width: 30%;
    min-width: 300px;
  }

  .upload-hint {
    text-decoration: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .upload-hint div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
