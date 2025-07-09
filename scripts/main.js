const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const remButton = document.querySelector(".remButton");
const copyContent = document.querySelector(".copyContent");

inputArea.addEventListener("input", () => {
  let raw = inputArea.value;

  let safe = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Task 1: Highlight spaces in href/src values only
  safe = safe.replace(/(href|src)=("|&quot;)(.*?)(\2)/gi, (match, attr, quote, value, endQuote) => {
    const highlightedValue = value.replace(/(\s+)/g, '<span class="highlight-space">$1</span>');
    return `${attr}=${quote}${highlightedValue}${endQuote}`;
  });

  // Task 2: Highlight suspicious characters and <script> blocks
  safe = safe.replace(/[�]/g, '<span class="highlight-badchar">�</span>');
  safe = safe.replace(/&lt;script&gt;.*?&lt;\/script&gt;/gis, (match) => {
    return `<span class="highlight-badchar">${match}</span>`;
  });

  outputArea.innerHTML = safe;
  if (inputArea.value.length > 0) {
    copyContent.style.display = "block";
  } else {
    copyContent.style.display = "none";
    outputArea.innerHTML = '<span class="outputText">Cleaned code output</span>';
  }
});

//click on highlighted element
document.addEventListener("click", function (event) {
  if (event.target.classList.contains("highlight-space")) {
    // Toggle the 'selected' class
    event.target.classList.toggle("spaceSelected");

    // Count how many elements have the 'selected' class
    const selectedCount = document.querySelectorAll(".highlight-space.spaceSelected").length;
    const totalCount = document.querySelectorAll(".highlight-space").length;
    //console.log(selectedCount);

    if (selectedCount >= 1) {
      //console.log("count: " + selectedCount);
      remButton.style.display = "block";
      document.getElementById("selectedCount").textContent = `${selectedCount}/${totalCount} white spaces selected`;
    } else {
      remButton.style.display = "none";
      document.getElementById("selectedCount").textContent = "";
    }
  }
});

//remove white spaces
remButton.addEventListener("click", () => {
  const selectedElements = document.querySelectorAll(".highlight-space.spaceSelected");

  selectedElements.forEach((element) => {
    element.remove(); // removes the element from the DOM
  });

  remButton.style.display = "none";
  document.getElementById("selectedCount").textContent = "";
});

//copy new code
copyContent.addEventListener("click", () => {
  const outputArea = document.getElementById("outputArea");

  if (outputArea) {
    const textToCopy = outputArea.textContent;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        //console.log("Content copied to clipboard.");
        document.querySelector("#alertBox").style.display = "block";
        setTimeout(function () {
          document.querySelector("#alertBox").style.display = "none";
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }
});
