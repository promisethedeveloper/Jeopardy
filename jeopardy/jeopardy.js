// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
	const response = await axios.get(
		"https://jservice.io/api/categories?count=100"
	);

	// console.log(response);

	const categoryIds = [];

	for (let i = 0; i < response.data.length; i++) {
		categoryIds.push(response.data[i].id);
	}

	// console.log(_.sampleSize(categoryIds, 6));

	// return an array of 6 random category ids using lodash
	return _.sampleSize(categoryIds, 6);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(categoryId) {
	const res = await axios.get(
		`https://jservice.io/api/category?id=${categoryId}`
	);
	// console.log(res.data);

	// Destructure the data gotten from the API
	const { title, clues } = res.data;

	// LET RANDOM CLUES
	let randomClues = _.sampleSize(clues, 5);

	// Create an empty array to hold category data
	const categoryDataArray = [];

	// Loop through the clues
	for (let i = 0; i < randomClues.length; i++) {
		// Get question, answer and set showing to null for each iteration on the clues
		const { question, answer, showing = null } = randomClues[i];

		// Create a clue object to save the question, answer and showing data
		const clueObj = { question, answer, showing };

		// Add the clue object to the categoryDataArray
		categoryDataArray.push(clueObj);
	}

	const categoryInformation = { title, clues: categoryDataArray };

	// console.log(categoryInformation);

	return categoryInformation;
}

// getCategory(11603);

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
	// Select the head of the table and empty it out
	$("thead").empty();

	// T E S T I N G
	const x = await getCategory(11603);
	console.log(x);

	// Create a table row
	let $tr = $("<tr></tr>");
	// Loop through the value of WIDTH, create a header cell and set the text to the category title
	for (let i = 0; i < 6; i++) {
		$tr.append($("<th></th>").text(x["title"]));
	}
	$("thead").append($tr);

	// Select table body
	$("tbody").empty();

	for (let y = 0; y < 5; y++) {
		// Create a table row
		let $tr = $("<tr></tr>");
		// determine how many td i.e divisions
		for (let x = 0; x < 6; x++) {
			$tr.append($("<td></td>").attr("id", `${y}-${x}`).text("?"));
		}
		$("tbody").append($tr);
	}
}

// T E S T I N G
fillTable();

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO
