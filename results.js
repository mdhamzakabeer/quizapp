// results.js
document.addEventListener('DOMContentLoaded', () => {
    const resultsList = document.getElementById('results-list');
    const clearBtn = document.getElementById('clear-results');
    const results = JSON.parse(localStorage.getItem("quizResults")) || [];
  
    if (results.length === 0) {
      resultsList.innerHTML = `
        <div class="text-center col-span-2 text-gray-600 text-lg">
          😕 No quiz attempts found. Take a quiz to see results here.
        </div>
      `;
      clearBtn.style.display = 'none';
      return;
    }
  
    resultsList.innerHTML = results.reverse().map((r, index) => `
      <div class="bg-white rounded-2xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition duration-300">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-primary">📄 Result #${results.length - index}</h3>
          <span class="text-sm text-gray-500">${r.date}</span>
        </div>
        <div class="text-sm text-gray-700 space-y-1">
          <p><span class="font-medium">Category ID:</span> ${r.categoryId}</p>
          <p><span class="font-medium">Score:</span> ${r.score} / ${r.total}</p>
          <div class="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div class="bg-primary h-3 rounded-full" style="width: ${(r.score / r.total) * 100}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  
    // Clear All Results
    clearBtn.addEventListener('click', () => {
      const confirmClear = confirm("Are you sure you want to delete all quiz results?");
      if (confirmClear) {
        localStorage.removeItem("quizResults");
        location.reload();
      }
    });
  });
  