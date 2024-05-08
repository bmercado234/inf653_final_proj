// Importing necessary modules and data
const data = {
    states: require('../model/statesData.json'),
    setStates: function (data) {this.states = data}
}
const mongoStates = require('../model/states.js');

// Controller functions for handling state-related requests

// Handle GET request for all states
const getAllStates = async (req, res) => {
    let statesList;
    const contig = req.query?.contig;

    if (contig === 'true') {
        // Filter contiguous states (excluding Alaska and Hawaii)
        statesList = data.states.filter(st => st.code !== 'AK' && st.code !== 'HI');
    } else if (contig === 'false') {
        // Filter non-contiguous states (Alaska and Hawaii)
        statesList = data.states.filter(st => st.code === 'AK' || st.code === 'HI');
    } else {
        // Return all states
        statesList = data.states;
    }

    // Fetch all states data from MongoDB
    const allMongoStates = await mongoStates.find({});
    
    // Merge funfacts from MongoDB with states data
    statesList.forEach(state => {
        try {
            const stateExists = allMongoStates.find(st => st.stateCode === state.code);
            if (stateExists) {
                state.funfacts = [...stateExists.funfacts];
            }
        } catch (err) {
            console.log(err);
        }
    });

    // Send the list of states as response
    res.json(statesList);
}

// Handle GET request for single state
const getState = async (req, res) => {
    const oneJSONState = data.states.filter(st => st.code === req.code)[0];
    const oneMongoState = await mongoStates.findOne({ stateCode: req.code }).exec();
    let singleStateData = oneJSONState;

    // Attach funfacts from MongoDB to the state data
    try {
        singleStateData.funfacts = oneMongoState.funfacts;
    } catch (err) {
        // Handle error
    }

    // Send the state data as response
    res.json(singleStateData);
}

// Handle GET request for a random funfact
const getFunfact = async (req, res) => {
    const oneMongoState = await mongoStates.findOne({ stateCode: req.code }).exec();

    // Check if state exists in the database
    if (!oneMongoState) {
        return res.status(404).json({"message": "No fun facts found for this state"});
    }

    // Get a random funfact from the state's funfacts array
    const randomFunfact = oneMongoState.funfacts[Math.floor(Math.random() * oneMongoState.funfacts.length)];
    
    // Send the random funfact as response
    res.json({"funfact": randomFunfact});
}

// Handle POST request to add a funfact
const createFunfact = async (req, res) => {
    // Check if funfacts array exists in request body
    if (!req.body?.funfacts || !Array.isArray(req.body.funfacts)) {
        return res.status(400).json({"message": "Invalid funfacts data"});
    }

    // Find the state in MongoDB
    const oneMongoState = await mongoStates.findOne({ stateCode: req.code }).exec();

    // If state doesn't exist in MongoDB, create it
    if (!oneMongoState) {
        try {
            const result = await mongoStates.create({
                "stateCode": req.code,
                "funfacts": req.body.funfacts
            });
            return res.status(201).json(result);
        } catch (err) {
            // Handle error
        }
    } else { // If state exists, update its funfacts
        const allFunfacts = [...oneMongoState.funfacts, ...req.body.funfacts];
        const update = await mongoStates.updateOne({ "stateCode": req.code }, { "funfacts": allFunfacts });
        const result = await mongoStates.findOne({ stateCode: req.code }).exec();
        return res.status(201).json(result);
    }
}

// Handle PATCH request to update a funfact
const updateFunfact = async (req, res) => {
    // Check if index and funfact exist in request body
    if (!req.body?.index || !req.body?.funfact) {
        return res.status(400).json({"message": "Index and funfact value required"});
    }

    // Find the state in MongoDB
    const oneMongoState = await mongoStates.findOne({ stateCode: req.code }).exec();

    // If state doesn't exist in MongoDB, return error
    if (!oneMongoState) {
        return res.status(404).json({"message": "No state found"});
    }

    // Update the funfact at the specified index
    const funfactIndex = req.body.index - 1;
    const allFunfacts = oneMongoState.funfacts;
    allFunfacts.splice(funfactIndex, 1, req.body.funfact);

    // Update the state in MongoDB
    const update = await mongoStates.updateOne({ "stateCode": req.code }, { "funfacts": allFunfacts });
    const result = await mongoStates.findOne({ stateCode: req.code }).exec();
    return res.status(201).json(result);
}

// Handle DELETE request to remove a funfact
const deleteFunfact = async (req, res) => {
    // Check if index exists in request body
    if (!req.body?.index) {
        return res.status(400).json({"message": "Index value required"});
    }

    // Find the state in MongoDB
    const oneMongoState = await mongoStates.findOne({ stateCode: req.code }).exec();

    // If state doesn't exist in MongoDB, return error
    if (!oneMongoState) {
        return res.status(404).json({"message": "No state found"});
    }

    // Remove the funfact at the specified index
    const funfactIndex = req.body.index - 1;
    const funfactArray = oneMongoState.funfacts.filter((element, index) => { return index != funfactIndex });
    oneMongoState.funfacts = funfactArray;

    // Save the updated state in MongoDB
    const result = await oneMongoState.save();
    return res.status(201).json(result);
}

// Handle GET request for state attributes (capital, nickname, population, admission)
const getAttribute = async (req, res) => {
    const oneJSONState = data.states.filter(st => st.code === req.code)[0];
    const pathArray = req.route.path.split('/');
    let attributeData;

    // Determine which attribute is requested and prepare the response data accordingly
    if (pathArray[2] === 'capital') {
        attributeData = {
            "state": oneJSONState.state,
            "capital": oneJSONState.capital_city
        };
    } else if (pathArray[2] === 'nickname') {
        attributeData = {
            "state": oneJSONState.state,
            "nickname": oneJSONState.nickname
        };
    } else if (pathArray[2] === 'population') {
        attributeData = {
            "state": oneJSONState.state,
            "population": oneJSONState.population.toLocaleString('en-US')
        };
    } else if (pathArray[2] === 'admission') {
        attributeData = {
            "state": oneJSONState.state,
            "admitted": oneJSONState.admission_date
        };
    }

    // Send the attribute data as response
    res.json(attributeData);
}

// Export all controller functions
module.exports = {
    getAllStates,
    getState,
    getFunfact,
    getAttribute,
    createFunfact,
    updateFunfact,
    deleteFunfact
}
