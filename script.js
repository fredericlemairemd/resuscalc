//Test pull git par master test branch
//Parties de l'écran affichant le calcul
const upperScreen = document.querySelector(".resultFirstRow p");
const middleScreen = document.querySelector(".resultSecondRow p");
const lowerScreen = document.querySelector(".resultThirdRow p");

//Tableau détenant le calcul
let arrayCalcul = [];

//Constantes associés au différents boutons
const allButtons = document.querySelectorAll("button");
const numberButton = document.querySelectorAll(".numberButton");
const clearButton = document.querySelector("#clearButton");
const operatorButton = document.querySelectorAll(".operatorButton");
const lbsButton = document.querySelector("#lbsButton");
const kgButton = document.querySelector("#kgButton");


//Animation du bouton
function animateButton(button) {
  button.classList.add("animation");
  setTimeout(function() {
    button.classList.remove("animation");
  }, 200);
}

//Associé le click du bouton à une animation
for (let element of allButtons) {
  element.addEventListener("click", function() {
    animateButton(this);
  })
}

//Son Click de souris (non utilisé vu lag avec PWA)
function playSound() {
  let audio = new Audio("sounds/MouseClick.wav");
  audio.play();
}


//Ajout du nombre désiré au tableau cacul
for (let element of numberButton) {
  element.addEventListener("click", function() {
    arrayCalcul.push(this.innerHTML);
    updateScreen();
  })
}

//Transforme le tableau calcul en string affichable sur l'écran calcul
function updateScreen() {
  middleScreen.innerHTML = arrayCalcul.join("");
  lowerScreen.innerHTML = "";
}

//Ajout au bouton "AC" la capacité de faire un reset du calcul et de l'affichage
clearButton.addEventListener("click", function() {
  clear();
  updateScreen();
});

//Vide le tableau calcul et les 3 écrans
function clear() {
  arrayCalcul = [];
  middleScreen.innerHTML = "";
  upperScreen.innerHTML = "";
  lowerScreen.innerHTML = "";
}


//Association de chaque bouton opérateur à une opération dans le tableau
for (let element of operatorButton) {
  element.addEventListener("click", function() {
    switch (this.innerHTML) {
      case "+":
        //Check if there's a result
        saveResult()
        arrayCalcul.push(" + ");
        updateScreen();
        break;
      case "-":
        saveResult()
        arrayCalcul.push(" - ");
        updateScreen();
        break;
      case "x":
        saveResult()
        arrayCalcul.push(" * ");
        updateScreen();
        break;
      case "/":
        saveResult()
        arrayCalcul.push(" / ");
        updateScreen();
        break;
      case "=":
        // Regarde si il faut ajouter un intervalle dans la réponse, si oui, le nombre est
        let valeurInterval = interval(arrayCalcul);
        console.log(valeurInterval);
        //Enlève le string "kg" pour permettre à la fonction éval de fonctionner
        let indexKg = arrayCalcul.indexOf("kg");
        if (indexKg !== -1) {
          arrayCalcul.splice(indexKg, 1);
        }
        let equation = arrayCalcul.join("");
        let result = eval(equation);
        //Casting de la valeur result en floating number à 1 décimale
        let roundedResult = parseFloat(result).toFixed(1);
        lowerScreen.innerHTML = `${roundedResult}${valeurInterval}`;
        break;
      default:
    }
  })
}

// Si un calcul est affiché dans le lowerscreen, l'utilisateur a appuyé sur "=" il faut donc
// vider le tableau du calcul et utilisé cette valeur pour des calculs supplémentaires.
// Ex : 1+1 = 2, si j'appuie sur "+" , la calculatrice débutera à 2 + , ça permet une réutilisation
// de la valeur calculée.
// Cette fonction doit être vérifiée à chaque fois qu'un opérateur est utilisé.

function saveResult() {
  if (lowerScreen.innerHTML !== "") {
    arrayCalcul = [];
    upperScreen.innerHTML = "";
    arrayCalcul.push(lowerScreen.innerHTML);
    middleScreen.innerHTML = arrayCalcul;
  }
}


//Convertir le poids lbs -> kg, générer lbs,kg,age pour le upperscreen
function convertToKg() {
  let actualLbs = middleScreen.innerHTML;
  let convertKg = actualLbs / 2.205;
  //Empêche l'utilisateur d'utiliser le convertToKg à n'importe quel moment
  if (isNaN(convertKg)) {
    clear();
    return middleScreen.innerHTML = "Erreur";
  }
  //Calcul des valeurs à 1 décimale près pour lbs, kg, age
  let roundedKg = convertKg.toFixed(1);
  let roundedLbs = parseFloat(actualLbs).toFixed(1);
  let roundedAge = convertToAge(roundedKg);
  upperScreen.innerHTML = `${roundedKg}kg, ${roundedLbs}lbs, ${roundedAge}`;
  //Tableau doit être effacé pour remplacer le chiffre en lbs par celui en kg
  arrayCalcul = [];
  arrayCalcul.push(roundedKg, "kg");
  updateScreen();
}

//Prendre le poids en kg, générler lbs,kg,age pour le upperscreen
function maintainKg() {
  let actualKg = middleScreen.innerHTML;
  let convertLbs = actualKg * 2.205;
  //Empêche l'utilisateur d'utiliser la fonction à n'importe quel moment
  if (isNaN(actualKg)) {
    clear();
    return middleScreen.innerHTML = "Erreur";
  }
  // Calcul des valeurs à 1 décimale près pour lbs,kg,age
  let roundedLbs = convertLbs.toFixed(1);
  let roundedKg = parseFloat(actualKg).toFixed(1);
  let roundedAge = convertToAge(roundedKg);
  upperScreen.innerHTML = `${roundedKg}kg, ${roundedLbs}lbs, ${roundedAge}`;
  arrayCalcul.push("kg");
  updateScreen();
}

//Association du bouton Kg et Lbs avec la fonction correspondante
lbsButton.addEventListener("click", function() {
  convertToKg();
})

kgButton.addEventListener("click", function() {
  maintainKg();
})

// The Best-Guess Formula : permet d'estimer un poids en fonction âge, j'ai seulement renverser l'équation
// For infants < 12 months: Weight (kg) = (age in months +9) / 2.
// age = (weight x 2) - 9
// For children aged 1 to 5 years: Weight (kg) = 2 × (age in years + 5)
// age = (weigh/2)-5
// For children aged 5 to 14 years: Weight (kg) = 4 × age in years.
// age = weigh / 4

function convertToAge(weight) {
  if (weight <= 10) {
    let age = Math.round((weight * 2) - 9);
    if (age <= 0) {
      return ("newborn");
    }
    return (`${age} mo`);
  } else if (weight <= 20) {
    let age = Math.round((weight / 2) - 5);
    if (age === 0) {
      return ("1 y/o");
    }
    return (`${age} y/o`);
  } else if (weight <= 56) {
    let age = Math.round(weight / 4);
    return (`${age} y/o`);
  } else if (weight <= 300) {
    return ("adult");
  }
  return ("");
}

function interval(array) {
  // Pourqu'un interval soit générer il faut un kg multiplié par un nombre et divisé par 2 3 4 6
  // En dehors de ces conditions, il ne faut pas généré d'interval.
  if (isNaN(array[0])) {
    return "";
  }
  // Pas besoin de spécifier la position de "kg" dans le tableau, car la fonction kg permet seulement
  // de générer une valeur si on entre un chiffre au début sans autre opérateur
  if (array.indexOf("kg") === -1) {
    return "";
  }
  if (array.indexOf(" * ") === -1) {
    return "";
  }
  //Recherche d'un signe "/" étant situé avant-dernier dans le tableau calcul
  let index = array.length - 2;
  if (array[index] !== " / ") {
    return "";
  }
  //Retourne le dernier chiffre du tableau, est par défault une valeur singulière puisque la condition préalable est un / en avant-dernière position du tableau
  let intervalNumber = array[array.length - 1];
  switch (intervalNumber) {
    case "2":
      return " q12h";
      break;
    case "3":
      return " q8h";
      break;
    case "4":
      return " q6h"
      break;
    case "6":
      return " q4h"
    default:
      return "";
  }
}
