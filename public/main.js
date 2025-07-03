
async function search() {
  const keyword = document.getElementById('searchInput').value;
  if (!keyword) return alert("Please enter a keyword");

  const res = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword })
  });

  const data = await res.json();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (data.length === 0) {
    resultsDiv.innerHTML = '<p>ไม่พบเอกสารที่ตรงกับคำค้น</p>';
    return;
  }

  data.forEach(doc => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h4>${doc.title}</h4>
      <p>${doc.description}</p>
      <a href="/uploads/${doc.filename}" target="_blank">📥 Download</a>
      <hr/>
    `;
    resultsDiv.appendChild(div);
  });
}

