/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Attente du demarrrage de l'apareil pour pouvoir lancer l'evenement Cordova
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // On initialise Cordova 

    //Parties de l'écran affichant le calcul
    const upperScreen = document.querySelector(".resultFirstRow");
    const middleScreen = document.querySelector(".resultSecondRow");
    const lowerScreen = document.querySelector(".resultThirdRow");

    // On initilise l'affichage de l'écran avec 0 
    middleScreen.innerHTML = '0';
    
    //Tableau détenant le calcul
    let arrayCalcul = [];

    //Constantes associés au différents boutons
    const allButtons = document.querySelectorAll("button");
    const numberButton = document.querySelectorAll(".numberButton");
    const clearButton = document.querySelector("#clearButton");
    const operatorButton = document.querySelectorAll(".btn-op");
    const lbsButton = document.querySelector("#lbsButton");
    const kgButton = document.querySelector("#kgButton");
    // constante click sound
    const clickyClasses = ['btn']; 

//Animation du bouton
function animateButton(button) {
    button.classList.add("animation");
    setTimeout(function() {
      button.classList.remove("animation");
    }, 200);
  }

  // touch sound native
    nativeclick.watch(clickyClasses);
  // vibrate touch
//   const touch = document.querySelector(".btn");
//     touch.addEventListener('click', function(){
//         navigator.vibrate(3000);
//     })

    
  //Associé le click du bouton à une animation
  for (let element of allButtons) {
    element.addEventListener("click", function() {
      animateButton(this);
    })
  }

    //Ajout du nombre désiré au tableau cacul
    for (let element of numberButton) {
        element.addEventListener("click", function () {
            arrayCalcul.push(this.innerHTML);
            updateScreen();
        })
    }
    
    //Transforme le tableau calcul en string affichable sur l'écran calcul
    function updateScreen() {
        //let holdingMiddleScreen = middleScreen.innerHTML;
        let fontSize = 200;
        const countMiddle = 18;
  
        middleScreen.innerHTML = arrayCalcul.join("");
        //Limite le nombre de digit à l'intérieur de l'écran
        // if (middleScreen.scrollWidth > middleScreen.clientWidth || middleScreen.scrollHeight > middleScreen.clientHeight) {
        //     middleScreen.innerHTML = holdingMiddleScreen;
        // }
        if(middleScreen.innerHTML.length >= countMiddle ) {
            middleScreen.innerHTML = middleScreen.innerHTML.substr(0, countMiddle);
            middleScreen.innerHTML = "Error"
        }
   
        while(middleScreen.scrollWidth > middleScreen.offsetWidth) {
          middleScreen.style.fontSize = fontSize + "%",
          fontSize--  
        }
      
        lowerScreen.innerHTML = ""
    }

    //Ajout au bouton "AC" la capacité de faire un reset du calcul et de l'affichage
    clearButton.addEventListener("click", function () {
        clear();
        updateScreen();
        middleScreen.style = '';
        middleScreen.innerHTML = '0';
        lowerScreen.style = '';
    });

    //Vide le tableau calcul et les 3 écrans
    function clear() {
        arrayCalcul = [];
        middleScreen.innerHTML = "0";
        upperScreen.innerHTML = "";
        lowerScreen.innerHTML = "";
    }

    //Association de chaque bouton opérateur à une opération dans le tableau
    for (let element of operatorButton) {
        element.addEventListener("click", function () {
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
                    arrayCalcul.push(" x ");
                    updateScreen();
                    break;
                case "÷":
                    saveResult()
                    arrayCalcul.push(" ÷ ");
                    updateScreen();
                    break;
                case "=":
                    // Regarde si il faut ajouter un intervalle dans la réponse
                    let valeurInterval = interval(arrayCalcul);
                    // Trouve si "Kg" a été entré , ne calcul rien si kg suivi d'un chiffre ex: 9kg9
                    let indexKg = arrayCalcul.indexOf("kg");
                    if (indexKg !== -1) {
                        if (!isNaN(arrayCalcul[indexKg + 1])) {
                            break;
                        }
                        //Retire kg pour permettre à la fonction éval de fonctionner
                        arrayCalcul.splice(indexKg, 1);
                    }

                    //Remplace le symbole ÷ par / pour permettre le calcul par la fonction eval
                    let indexDiv = arrayCalcul.indexOf(" ÷ ")
                    if (indexDiv !== -1) {
                        arrayCalcul.splice(indexDiv, 1, "/");
                    }

                    //Remplace le symbole x par * pour permettre le calcul de la fonction eval
                    let indexMultiply = arrayCalcul.indexOf(" x ")
                    if (indexMultiply !== -1) {
                        arrayCalcul.splice(indexMultiply, 1, "*");
                    }

                    let equation = arrayCalcul.join("");
                    let result = eval(equation);
                    const countLower = 10;
                    //Casting de la valeur result en floating number à 1 décimale
                    //let roundedResult = parseFloat+(result).toFixed(1);
                    // On enleve les zeros inutiles
                    // Pour supprimer les zéros de fin non significatifs d'un nombre, nous pouvons appeler toFixed ou toString pour le convertir en une chaîne numérique.
                    //let roundedResult = result.toString();
                    let roundedResult = parseFloat(result.toFixed(2));
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
        let lowerScreenResult = lowerScreen.innerHTML;
        if (lowerScreenResult !== "") {
            arrayCalcul = [];
            upperScreen.innerHTML = "";
            //Enlève l'intervalle pour permettre la réutilisation de la valeur
            let splitResult = lowerScreenResult.split(" ");
            arrayCalcul.push(splitResult[0]);
            middleScreen.innerHTML = arrayCalcul;
        }
    }


    //Convertir le poids lbs -> kg, générer lbs,kg,age pour le upperscreen
    function convertToKg() {
        let actualLbs = middleScreen.innerHTML;
        let convertKg = actualLbs / 2.205;
        //Empêche l'utilisateur d'utiliser le convertToKg à n'importe quel moment
        if (isNaN(convertKg) || actualLbs === "") {
            navigator.vibrate(3000);
            clear();
            return middleScreen.innerHTML = "Error";
        }
        //Empêche user d'entrer des lbs non humain
        if (actualLbs > 442) {
            navigator.vibrate(3000);
            clear();
            return middleScreen.innerHTML = "Error";
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
        if (isNaN(actualKg) || actualKg === "") {
            navigator.vibrate(3000);
            clear();
            return middleScreen.innerHTML = "Error";
        }
        //Empêche user d'entrer des kg non humain
        if (actualKg > 201) {
            navigator.vibrate(3000);
            clear();
            return middleScreen.innerHTML = "Error";
        }
        // Calcul des valeurs à 1 décimale près pour lbs,kg,age
        let roundedLbs = convertLbs.toFixed(1);
        let roundedKg = parseFloat(actualKg).toFixed(1);
        let roundedAge = convertToAge(roundedKg);
        upperScreen.innerHTML = `${roundedKg}kg / ${roundedLbs}lbs / ${roundedAge}`;
        arrayCalcul.push("kg");
        updateScreen();
    }

    //Association du bouton Kg et Lbs avec la fonction correspondante
    lbsButton.addEventListener("click", function () {
        convertToKg();
    })

    kgButton.addEventListener("click", function () {
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
        if (array.indexOf(" x ") === -1) {
            return "";
        }
        //Recherche d'un signe "÷" étant situé avant-dernier dans le tableau calcul
        let index = array.length - 2;
        if (array[index] !== " ÷ ") {
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

   

}