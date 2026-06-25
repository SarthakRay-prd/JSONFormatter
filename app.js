const inputText = document.getElementById('inputText');
const operationSelect = document.getElementById('operationSelect');
const submitBtn = document.getElementById('submitBtn');
const resultOutput = document.getElementById('resultOutput');

async function submitForm() {
  const text = inputText.value.trim();
  const operation = operationSelect.value;

  if (!text) {
    resultOutput.textContent = 'Please enter text before submitting.';
    return;
  }

  resultOutput.textContent = 'Processing...';

  try {
    const response = await fetch('/api/HTTPSTrigger', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, operation })
    });

    const data = await response.json();

    if (!response.ok) {
      resultOutput.textContent = JSON.stringify(data, null, 2);
      return;
    }

    resultOutput.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultOutput.textContent = `Request failed: ${error.message}`;
  }
}

submitBtn.addEventListener('click', submitForm);
inputText.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    submitForm();
  }
});
