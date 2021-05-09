function findSum() {
  /* 
    the find function calls itself recursively, picking a random card from the cards array and 
    summing up the number on each card until the sum exceeds 124
  */
  let cards = [1, 2, 3, 4, 5, 6, 7];
  const find = (current) => {
    if (cards.length === 0 || current > 124) {
      return current;
    }

    /* pick a random card from the array */
    let index = Math.floor(cards.length * Math.random());
    let card = cards.splice(index, 1); 
    let number = Math.pow(2, card - 1);

    return find(current + number);
  } 
  return find(0);
}

function getResults(times) {
  let sums = [];
  for (let i = 0; i < times; i++) {
    let sum = findSum();
    sums.push(sum); /* adds the result to the results array */
  }
  
  return sums;
}

function getNumberOfOccurrences(results) {
  let occurrences = {};
  for (let r of results) {
    if (Object.keys(occurrences).includes(String(r))) {
      occurrences[r] += 1;
    } else {
      occurrences[r] = 1; 
    }
  }
  return occurrences;
}

function getProbabilities(occurrences, sums) {
  const probabilities = {};

  for (let n in occurrences) {
    /* probability of occurrence to three decimal places */
    let probability = Math.round(occurrences[n] / sums.length * 1000) / 1000;
    probabilities[n] = probability;
  }

  return probabilities;
}

function displayResults(results, occurrences) {
  let max = Math.max(...Object.values(results));
  
  /* most occurring sum */
  let most = Object.keys(results).find(p => results[p] === max);

  let tbody = '';
  for (let p in results) {
    tbody += `
      <tr>
        <td>${p}</td>
        <td>${occurrences[p]}</td>
        <td>${results[p]}</td>
      </tr>`;
  }
  document.querySelector('tbody').innerHTML += tbody;
  document.querySelector('.most-occuring').innerText = most;
}

/* all sums from picking all the cards randomly 5040 times */
const sums = getResults(5040); 

/* number of times each sum occurs */
const occurrences = getNumberOfOccurrences(sums);

/* finds the probability of occurrence for all sums */
const probabilities = getProbabilities(occurrences, sums);

displayResults(probabilities, occurrences);