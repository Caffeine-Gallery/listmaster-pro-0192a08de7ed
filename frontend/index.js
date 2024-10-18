import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item');
  const itemTypeInput = document.getElementById('item-type');
  const chartContainer = document.getElementById('chart');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="${item.completed ? 'completed' : ''}">
          ${item.text} (${item.itemType})
        </span>
        <div>
          <button class="toggle-btn" data-id="${item.id}">
            <i class="fas ${item.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
          </button>
          <button class="delete-btn" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      shoppingList.appendChild(li);
    });
    renderChart();
  }

  // Function to render the chart
  async function renderChart() {
    const stats = await backend.getItemTypeStats();
    chartContainer.innerHTML = '';
    const maxCount = Math.max(...stats.map(([_, count]) => count));
    stats.forEach(([type, count]) => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.width = `${(count / maxCount) * 100}%`;
      bar.textContent = `${type}: ${count}`;
      chartContainer.appendChild(bar);
    });
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = newItemInput.value.trim();
    const itemType = itemTypeInput.value.trim();
    if (text && itemType) {
      await backend.addItem(text, itemType);
      newItemInput.value = '';
      itemTypeInput.value = '';
      await renderShoppingList();
    }
  });

  // Toggle completed status
  shoppingList.addEventListener('click', async (e) => {
    if (e.target.closest('.toggle-btn')) {
      const id = Number(e.target.closest('.toggle-btn').dataset.id);
      await backend.toggleCompleted(id);
      await renderShoppingList();
    }
  });

  // Delete item
  shoppingList.addEventListener('click', async (e) => {
    if (e.target.closest('.delete-btn')) {
      const id = Number(e.target.closest('.delete-btn').dataset.id);
      await backend.deleteItem(id);
      await renderShoppingList();
    }
  });

  // Initial render
  await renderShoppingList();
});
