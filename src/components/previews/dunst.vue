<template>

<div class="container">
     <div class="notification low">
          <h3>Low urgency</h3>
          <p>This is a low urgency notification.</p>
     </div>
     <div class="notification normal">
          <h3>Normal</h3>
          <p>This is a normal notification.</p>
     </div>
     <div class="notification urgent">
          <h3>Urgent</h3>
          <p>This is an urgent notification.</p>
     </div>
</div>


</template>

<style scoped>

.container {
     display: flex;
     flex-direction: row;
     flex-wrap: wrap;
     gap: 0.5rem;
     height: min-content;
}

.notification {
     border-style: solid;
     border-width: 3px;
     padding: 8px;
     width: 300px;
}


.low {
     color: var(--dunst-low-fg);
     background-color: var(--dunst-low-bg);
     border-color: var(--dunst-low-frame);
}
.normal {
     color: var(--dunst-normal-fg);
     background-color: var(--dunst-normal-bg);
     border-color: var(--dunst-normal-frame);
}
.urgent {
     color: var(--dunst-urgent-fg);
     background-color: var(--dunst-urgent-bg);
     border-color: var(--dunst-urgent-frame);
}

</style>
