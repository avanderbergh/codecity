<script>
  let x = 0;
  let y = 0;
  const handleMouseMove = e => {
    x = e.clientX;
    y = e.clientY;
  };
</script>

<svelte:window on:mousemove={handleMouseMove}/>

<div class="bg-image">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="100%"
    height="100%"
  >
    <image
      xlink:href="images/bg1.png"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    />
    <mask id="mask1">
      <circle cx={x} cy={y} r="300" fill="white" />
    </mask>
    <image
      xlink:href="images/bg2.png"
      width="100%"
      height="100%"
      mask="url(#mask1)"
      preserveAspectRatio="xMidYMid slice"
    />
  </svg>

</div>

<style>
  .bg-image {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
  }
</style>
