var preJobs = []; //hold entire speeches
var countJobs; //go through each word separately
var jobs = []; //hold most common words
var jobsData = []; //hold collected data
var horizontalLabels = ["adjective", "noun", "adverb", "verb"]; //labels for graphs

function preload() {
  preJobs = loadStrings("steve_jobs_speech.txt"); //text file with speeches
}

function setup() {
  opts = { //ignore irrelevant parts of words like punctuation etc
    ignoreCase: true,
    ignorePunctuation: true,
    ignoreStopWords: true
  };

  countJobs = RiTa.concordance(preJobs.join(" "), opts); //use rita to sort through words by amount used
  for (var i in countJobs) {
    if (countJobs.hasOwnProperty(i)) {
      if (countJobs[i] > 10) { //if word is used more than 4 times
        jobs.push(new Word(i, countJobs[i], 'Jobs')); //add to most common words list
      }
    }
    jobs.sort((a, b) => (a.numUsed < b.numUsed) ? 1 : -1) //sort list of common words by frequency
  }

  jobsData = getPosNumbers(countJobs); //use function to store data of speeches
  textAlign(CENTER);
  createCanvas(600, 800)
  print(jobs);
}

function draw() {
  background(0);
  drawGraph(jobsData, "Frequency of Parts of Speech \n in Steve Jobs' Talks");
}

class Word { //class for word objects
  constructor(word, numUsed, author) {
    this.word = word; //store actual word
    this.pos = RiTa.pos(this.word)[0]; //get part of speech from RiTa, returns array so need to get first position
    this.author = author; //store author
    this.numUsed = numUsed;
  }
}

function getPosNumbers(wordList) {
  var adjCount = 0;
  var nounCount = 0;
  var adverbCount = 0;
  var verbCount = 0;
  for (var i in wordList) {
    pos = RiTa.pos(i)[0];
    if (pos == 'jj' || pos == 'jjs' || pos == 'jjr') { //check tags for different kinds of adjectives
      adjCount++;
    } else if (pos == 'nn' || pos == 'nns' || pos == 'nnp' || pos == 'nnps') {
      nounCount++;
    } else if (pos == 'rb' || pos == 'rbr' || pos == 'rbs') {
      adverbCount++;
    } else if (pos == 'vb' || pos == 'vbd' || pos == 'vbg' || pos == 'vbn' ||
      pos == 'vbp' || pos == 'vbz') {
      verbCount++;
    }
  }
  var totalWords = adjCount + nounCount + adverbCount + verbCount; //for percentage calculation
  return [adjCount, nounCount, adverbCount, verbCount, totalWords]; //send back calculated data
}

function drawGraph(data, title) { //takes what data to use and what the title is
  fill(255);
  textSize(30);
  text(title, 350, 50)
  for (var i = 0; i < 4; i++) { //go through the 4 pieces of data
    textSize(12);
    fill(255);
    text(horizontalLabels[i], i * 125 + 175, 750) //add labels
    rect(i * 125 + 150, 730 - data[i], 50, data[i]) //create rectangles for graph
    fill(0);
    text(data[i], i * 125 + 175, 710) //add specific numbers for clarity
  }
  maxValue = max(data);
  for (var k = 0; k < maxValue; k = k + 50) { //displays labels
    fill(255);
    text(k, 50, 730 - k);
  }
}
