import './css/styles.css';
import './css/iconstyles.css';
document.addEventListener('DOMContentLoaded', () => {
  let history = [];
  let historyIndex = -1;
  let selectedElement = null;

  function makeDraggable(element) {
    let shiftX, shiftY;

    element.onmousedown = function (event) {
      shiftX = event.clientX - element.offsetLeft;
      shiftY = event.clientY - element.offsetTop;

      function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
        saveState();
      };

      element.ondragstart = function () {
        return false;
      };
    };
  }

  function saveState() {
    history = history.slice(0, historyIndex + 1);
    history.push(document.querySelector('.whiteboard').innerHTML);
    historyIndex++;
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      document.querySelector('.whiteboard').innerHTML = history[historyIndex];
      restoreDraggable();
    }
  }

  function redo() {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      document.querySelector('.whiteboard').innerHTML = history[historyIndex];
      restoreDraggable();
    }
  }

  function restoreDraggable() {
    const elements = document.querySelectorAll('.text-element');
    elements.forEach(makeDraggable);
  }

  function updateFontColor() {
    const col = document.getElementById('fontColor').value;
    if (selectedElement) {
      selectedElement.style.color = col;
      saveState();
    }
  }

  document
    .getElementById('fontColor')
    .addEventListener('input', updateFontColor);

  const add = document.querySelector('#add');
  add.addEventListener('click', () => {
    const textElement = document.createElement('div');
    textElement.contentEditable = true;
    textElement.className = 'text-element';
    textElement.style.fontSize = `${16}px`;
    textElement.style.fontFamily = document.getElementById('fontFamily').value;
    textElement.style.color = 'black';
    textElement.innerText = 'Enter Text';
    textElement.style.position = 'absolute';
    textElement.style.left = '50px';
    textElement.style.top = '50px';
    document.querySelector('.whiteboard').appendChild(textElement);
    makeDraggable(textElement);
    selectElement(textElement);
    saveState();
  });

  document.querySelector('.whiteboard').addEventListener('click', (e) => {
    if (e.target.classList.contains('text-element')) {
      selectElement(e.target);
    } else {
      if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
      }
    }
  });

  function selectElement(element) {
    if (selectedElement) {
      selectedElement.classList.remove('selected');
    }
    selectedElement = element;
    selectedElement.classList.add('selected');

    document.getElementById('fontSize').value = parseInt(
      window.getComputedStyle(selectedElement).fontSize
    );
  }

  saveState();

  document.getElementById('fontSize').addEventListener('input', () => {
    if (selectedElement) {
      selectedElement.style.fontSize = `${document.getElementById('fontSize').value}px`;
      saveState();
    }
  });

  document.getElementById('fontFamily').addEventListener('input', () => {
    if (selectedElement) {
      selectedElement.style.fontFamily =
        document.getElementById('fontFamily').value;
      saveState();
    }
  });

  document
    .querySelector('.toolbar button[onclick="undo()"]')
    .addEventListener('click', undo);
  document
    .querySelector('.toolbar button[onclick="redo()"]')
    .addEventListener('click', redo);
});
