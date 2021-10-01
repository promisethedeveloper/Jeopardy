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
	console.log("The data", res);

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

	// Create a table row
	let $tr = $("<tr></tr>");
	// Loop through the value of WIDTH, create a header cell and set the text to the category title
	// i is the category index
	for (let i = 0; i < 6; i++) {
		// $tr.append($("<th></th>").text(x["title"]));
		$tr.append($("<th></th>").text(categories[i].title));
	}
	$("thead").append($tr);

	// Select table body
	$("tbody").empty();

	// y is the clue index
	for (let y = 0; y < 5; y++) {
		// Create a table row i.e row of clues
		let $tr = $("<tr></tr>");
		// determine how many td i.e divisions, x is a category index
		for (let x = 0; x < 6; x++) {
			// Set the id to the clue index - category Index
			$tr.append($("<td></td>").attr("id", `${y}-${x}`).text("?"));
		}
		$("tbody").append($tr);
	}
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
	const el = evt.target;
	const clueIndex = el.id[0];
	const catIndex = el.id[2];

	let clue = categories[catIndex].clues[clueIndex];
	if (clue.showing === null) {
		$(`#${clueIndex}-${catIndex}`).html(`${clue.question}`);
		clue.showing = "question";
	} else if (clue.showing === "question") {
		$(`#${clueIndex}-${catIndex}`).text(`${clue.answer}`);
		clue.showing = "answer";
	} else {
		return;
	}
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
	let ids = await getCategoryIds();
	for (let i = 0; i < ids.length; i++) {
		categories.push(await getCategory(ids[i]));
	}
	fillTable();
}

/** On click of start / restart button, set up game. */

// TODO
$("button").on("click", setupAndStart);

/** On page load, add event handler for clicking clues */

// TODO
$("table").on("click", "td", handleClick);
