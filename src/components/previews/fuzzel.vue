<template>

<div class="container">
     <div class="fuzzel">
          <div><span class="prompt">&gt;</span><span class="input">fi</span><span class="placeholder">placeholder</span><span class="counter">4/223</span></div>
          <div class="item"><span class="match">Fi</span>refox Web Browser</div>
          <div class="item"><span class="match">Fi</span>le Manager</div>
          <div class="item selection"><span class="match">Fi</span>leZilla</div>
          <div class="item">Noti<span class="match">fi</span>cations</div>
     </div>
</div>

</template>

<style scoped>

.fuzzel {
     display: flex;
     flex-direction: column;

     height: min-content;
     width: 30rem;
     padding: 8px 40px;

     border-style: solid;
     border-width: 1px;
     border-radius: 10px;

     background-color: var(--fuzzel-background);
     border-color: var(--fuzzel-border);
     color: var(--fuzzel-text);
}

.item {
     line-height: 1.5em;
}

.prompt {
     color: var(--fuzzel-prompt);
     margin-right: 0.5rem;
}
.input {
     color: var(--fuzzel-input);
}

.placeholder {
     color: var(--fuzzel-placeholder);
     margin-left: 0.5rem;
}
.counter {
     color: var(--fuzzel-counter);
     float: right;
}

.match {
     color: var(--fuzzel-match);
}
.selection {
     color: var(--fuzzel-selection-text);
     background-color: var(--fuzzel-selection);
     font-weight: bold;
}
.selection .match {
     color: var(--fuzzel-selection-match);
}

</style>
