<template>

<div style="background-color: var(--b24-00); color: var(--b24-05);">

     <div class="b24-swatch">
          <div style="background-color: var(--b24-11);"></div>
          <div style="background-color: var(--b24-10);"></div>
          <div style="background-color: var(--b24-00);"></div>
          <div style="background-color: var(--b24-01);"></div>
          <div style="background-color: var(--b24-02);"></div>
          <div style="background-color: var(--b24-03);"></div>
          <div style="background-color: var(--b24-04);"></div>
          <div style="background-color: var(--b24-05);"></div>
          <div style="background-color: var(--b24-06);"></div>
          <div style="background-color: var(--b24-07);"></div>

          <div></div>
          <div></div>
          <div style="background-color: var(--b24-08);"></div>
          <div style="background-color: var(--b24-09);"></div>
          <div style="background-color: var(--b24-0A);"></div>
          <div style="background-color: var(--b24-0B);"></div>
          <div style="background-color: var(--b24-0C);"></div>
          <div style="background-color: var(--b24-0D);"></div>
          <div style="background-color: var(--b24-0E);"></div>
          <div style="background-color: var(--b24-0F);"></div>
          
          <div></div>
          <div></div>
          <div style="background-color: var(--b24-12);"></div>
          <div></div>
          <div style="background-color: var(--b24-13);"></div>
          <div style="background-color: var(--b24-14);"></div>
          <div style="background-color: var(--b24-15);"></div>
          <div style="background-color: var(--b24-16);"></div>
          <div style="background-color: var(--b24-17);"></div>
          <div></div>
     </div>
     
     <p class="monospace">Normal text is in this colour.</p>

     <div class="examples monospace">
          <div style="color: var(--b24-03);">// Comments</div>
          <div style="color: var(--b24-08);">$variables and &lt;tags&gt;</div>
          <div style="color: var(--b24-09);">constants and literals</div>
          <div style="color: var(--b24-0A);">Classes</div>

          <div style="color: var(--b24-0B);">"strings"</div>
          <div style="color: var(--b24-0C);">/regexes/ and \escape characters</div>
          <div style="color: var(--b24-0E);">keywords</div>
          <div style="color: var(--b24-0F);">&lt;? embedded language tags ?&gt;</div>

          <div><span style="background-color: var(--b24-02);">Selected text</span></div>
          <div><span style="background-color: var(--b24-0A);">Search highlights</span></div>
          <div><span style="background-color: var(--b24-0F);">Deprecated</span></div>
          <div style="background-color: var(--b24-01); color: var(--b24-04)">Status Bars</div>
     </div>
</div>



</template>

<style scoped>

.b24-swatch {
     width: 100%;
     display: grid;
     grid-template-columns: repeat(10, 2rem);
     grid-template-rows: repeat(3, 2rem);
}

.examples {
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     grid-template-rows: repeat(4, 1fr);
}

</style>
