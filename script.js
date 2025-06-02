const btn = document.querySelector(".btn");
const inputBox = document.querySelector(".search-input");
const recipeContainer = document.querySelector(".recipe-container");
const loader = document.querySelector(".loader");
const hoverCard = document.querySelector(".hover-card");
const closeBtn = document.querySelector(".close-btn");

const API_KEY = "www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata";

const findIngrediants = (recipe) => {
  const ingredientList = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe?.[`strIngredient${i}`];
    const measure = recipe?.[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      const ingredientString =
        measure && measure.trim() !== ""
          ? `${ingredient.trim()} - ${measure.trim()}`
          : ingredient.trim();
      ingredientList.push(ingredientString);
    }
  }

  const ingredientsUl = document.createElement("ul");
  ingredientsUl.classList.add("ingredients");
  ingredientList.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientsUl.appendChild(li);
  });

  return ingredientsUl.outerHTML;
};

const openRecipePopup = (recipe) => {
  hoverCard.textContent = "";
  hoverCard.style.display = "block";
  const title = document.createElement("h3");
  title.textContent = recipe.strMeal;
  hoverCard.append(title);
  hoverCard.innerHTML += `
      <div class="top d-flex justify-content-between">
        <h4>Ingredients</h4>
        <button class="btn close-btn">
          <span>
            <i class="fa-solid fa-xmark"></i>
          </span>
        </button>
      </div>`;

  hoverCard.innerHTML += findIngrediants(recipe);

  hoverCard.innerHTML += `
          <div class = "instructions-container">
            <h3>Instructions:</h3>
            <p class="instructions">${recipe.strInstructions}</p>
          </div>
  `;

  const button = document.createElement("button");
  button.classList.add("btn", "btn-primary", "linkBtn");

  const link = document.createElement("a");
  link.style.padding = "10px";

  link.classList.add("link");
  link.href = recipe.strSource || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View full Recipe";
  button.appendChild(link);

  hoverCard.append(button);

  hoverCard.querySelector(".close-btn").addEventListener("click", () => {
    hoverCard.style.display = "none";
  });
};

const displayRecipes = (recipes) => {
  recipeContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    recipeContainer.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  recipes.forEach((recipe) => {
    console.log(typeof recipe);
    const {
      strMeal = "Unknown Meal",
      strMealThumb = "",
      strCategory = "",
      strArea = "",
    } = recipe || {};

    const article = document.createElement("article");
    article.classList.add("recipe");

    const img = document.createElement("img");
    img.src = strMealThumb;
    img.alt = `Image of ${strMeal}`;
    article.appendChild(img);

    const title = document.createElement("h2");
    title.textContent = strMeal;
    article.appendChild(title);

    const recipeArea = document.createElement("h4");
    recipeArea.textContent = strArea;
    article.appendChild(recipeArea);

    const category = document.createElement("h4");
    category.textContent = strCategory;
    article.appendChild(category);

    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "linkBtn");
    button.textContent = "View Recipe";

    article.appendChild(button);

    button.addEventListener("click", () => openRecipePopup(recipe));

    recipeContainer.appendChild(article);
  });
};

const fetchRecipes = async (searchTerm) => {
  recipeContainer.innerHTML = "";
  try {
    loader.style.display = "block";
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );
    const response = await data.json();
    console.log(response.meals);
    if (response.meals) {
      displayRecipes(response.meals);
    } else {
      console.log("No recipes found");
      recipeContainer.innerHTML = "<h3>No recipes found!</h3>";
    }
  } catch {
    loader.style.display = "none";
    console.error("Error fetching recipes");
    recipeContainer.innerHTML = "<h3>No recipes found!</h3>";
  } finally {
    loader.style.display = "none";
  }
};

const handleSearch = (e) => {
  e.preventDefault();
  const searchTerm = inputBox.value.trim();
  if (!searchTerm) {
    alert("Please enter a search term.");
    return;
  } else {
    console.log(searchTerm);
    fetchRecipes(searchTerm);
  }
};

const showHoverCard = (recipe) => {
  if ((hoverCard.style.display = "none")) {
    hoverCard.style.display = "block";
  } else {
    hoverCard.style.display = "none";
  }
};

closeBtn.addEventListener("click", () => {
  hoverCard.style.display = "none";
});

btn.addEventListener("click", handleSearch);
