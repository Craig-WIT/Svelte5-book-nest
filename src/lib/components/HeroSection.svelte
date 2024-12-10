<script>
  import heroImage from "$assets/hero.png"
  import Button from "./Button.svelte";
</script>

<section class="default-margin flex justify-between items-center mt-24 mb-20">
  <div class="hero-text flex flex-col items-start pr-12">
    <h1>Book Nest</h1>
    <h3>Your personal book library</h3>
    <h4 class="mt-l">
      Create your very own digital book library
    </h4>
    <h4 class="mb-s">
      Our app makes managing your connection a joy
    </h4>
    <Button href="/register">Sign Up</Button>
  </div>
  <img src="{heroImage}" alt="" class="w-2/5">
</section>

<style>
  /* .hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 100px;
    margin-bottom: 80px;
  }

  .hero-image {
    width: 40%;
  } */

  .hero-text {
    /* display: flex;
    flex-direction: column;
    align-items: flex-start; */
    width: 55%;
    /* padding-right: 50px; */
  }
</style>
