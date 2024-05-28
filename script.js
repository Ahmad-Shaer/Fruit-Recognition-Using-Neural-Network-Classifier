let activationMethod = "Sigmoid",
    numberOfNeuron = 2,
    learningRate = 0.8,
    maxNumOfEpoches = 1000,
    sweetnessInput = 0,
    colorInput = "Orange",
    accuracy = 0,
    totalNumberOfFruits = 0,
    Goal,
    x1,
    x2,
    threshold = 0.4,
    weightSum;
// let fruits = ["Apple","Orange","Banana"];
let fruitValues = { "Apples": 923823, "Oranges": 25000, "Banana": 3242 }; // decimal value of the colors
let colorMapping = { "Red": 5000, "Orange": 10000, "Yellow": 79034 }; // decimal value of the colors
let fruitsObjects = [];
let neurons = [];
let OutputValues = [];

function computeWeightSum(indexF, indexN) {
    x1 = parseFloat(fruitsObjects[indexF].sweetness);
    x2 = colorMapping[fruitsObjects[indexF].color];
    weightSum = x1 * neurons[indexN].inputW1 + x2 * neurons[indexN].inputW2 + threshold;
    return weightSum;
}

$("#btn_play").click(() => {
    let v = 2.4 / numberOfNeuron;
    for (let i = 0; i < numberOfNeuron; i++) {
        neurons.push({
            'inputW1': -1 * v,
            'inputW2': -1 * v,
            'outputW': v,
            'Yvalue': 0
        });
    }

    let epochBreak = false;

    for (let e = 0; e < maxNumOfEpoches; e++) {
        if (epochBreak) break;

        for (let i = 0; i < totalNumberOfFruits; i++) {
            // input weights from the inputs
            for (let j = 0; j < numberOfNeuron; j++) {
                switch (activationMethod) {
                    case "Sigmoid": neurons[j].Yvalue = sigmoidF(computeWeightSum(i, j, 0));
                        break;
                    case "Tangent": neurons[j].Yvalue = tangentF(computeWeightSum(i, j, 0));
                        break;
                    case "Relu": neurons[j].Yvalue = reluF(computeWeightSum(i, j, 0));
                        break;
                    case "Linear": neurons[j].Yvalue = linearF(computeWeightSum(i, j, 0));
                        break;
                }
            }

            // output weights for the Y output
            let sum = 0;
            for (let j = 0; j < numberOfNeuron; j++) {
                sum += neurons[j].outputW * neurons[j].Yvalue;
            }
            let outputWeight = sum + threshold;
            let finalOutput;
            let errH, errO, deltaW;
            switch (activationMethod) {
                case "Sigmoid": finalOutput = sigmoidF(outputWeight);
                    OutputValues.push(finalOutput);
                    errO = OutputValues[i] * (1 - OutputValues[i]) * (fruitValues[fruitsObjects[i].realFruit] - OutputValues[i]);
                    for (let z = 0; z < numberOfNeuron; z++) {
                        deltaW = errO * neurons[z].Yvalue * learningRate;
                        errH = neurons[z].Yvalue * (1 - neurons[z].Yvalue) * errO * neurons[z].outputW;
                        neurons[z].outputW = neurons[z].outputW + deltaW;
                        deltaW = learningRate * neurons[z].inputW1 * errH;
                        neurons[z].inputW1 = neurons[z].inputW1 + deltaW;
                        deltaW = learningRate * neurons[z].inputW2 * errH;
                        neurons[z].inputW2 = neurons[z].inputW2 + deltaW;
                    }

                    break;
                case "Tangent": finalOutput = tangentF(outputWeight);
                    OutputValues.push(finalOutput);
                    errO = -4 * OutputValues[i] * (1 - OutputValues[i]) * (fruitValues[fruitsObjects[i].realFruit] - OutputValues[i]);
                    for (let z = 0; z < numberOfNeuron; z++) {
                        deltaW = errO * neurons[z].Yvalue * learningRate;
                        errH = -4 * neurons[z].Yvalue * (1 - neurons[z].Yvalue) * errO * neurons[z].outputW;
                        neurons[z].outputW = neurons[z].outputW + deltaW;
                        deltaW = learningRate * neurons[z].inputW1 * errH;
                        neurons[z].inputW1 = neurons[z].inputW1 + deltaW;
                        deltaW = learningRate * neurons[z].inputW2 * errH;
                        neurons[z].inputW2 = neurons[z].inputW2 + deltaW;
                    }
                    break;
                case "Linear":
                case "Relu": finalOutput = reluF(outputWeight);
                    OutputValues.push(finalOutput);
                    errO = 1 * (fruitValues[fruitsObjects[i].realFruit] - OutputValues[i]);
                    for (let z = 0; z < numberOfNeuron; z++) {
                        deltaW = errO * neurons[z].Yvalue * learningRate;
                        errH = 1 * errO * neurons[z].outputW;
                        neurons[z].outputW = neurons[z].outputW + deltaW;
                        deltaW = learningRate * neurons[z].inputW1 * errH;
                        neurons[z].inputW1 = neurons[z].inputW1 + deltaW;
                        deltaW = learningRate * neurons[z].inputW2 * errH;
                        neurons[z].inputW2 = neurons[z].inputW2 + deltaW;
                    }
                    break;
            }
            if (Math.abs(finalOutput - fruitValues["Orange"]) < Math.abs(finalOutput - fruitValues["Banana"])) {
                if (Math.abs(finalOutput - fruitValues['Orange']) < Math.abs(finalOutput - fruitValues['Apples'])) {
                    fruitsObjects[i].aiOutputFruit = "Oranges";
                } else {
                    fruitsObjects[i].aiOutputFruit = "Apples";
                }
            } else if (Math.abs(finalOutput - fruitValues['Banana']) < Math.abs(finalOutput - fruitValues['Apples'])) {
                fruitsObjects[i].aiOutputFruit = "Banana";
            } else {
                fruitsObjects[i].aiOutputFruit = "Apples";
            }

            // let count = 0;
            // for(let i=0; i< totalNumberOfFruits;i++){
            //     switch (activationMethod) {
            //         case "Sigmoid": if(fruitsObjects[i].color === "Orange") {
            //             fruitsObjects[i].aiOutputFruit ="Oranges";
            //             count++;
            //         }
            //         else {
            //             if(fruitsObjects[i].color === "Red")count++;
            //             fruitsObjects[i].aiOutputFruit = "Apples";
            //
            //         }
            //
            //
            //             break;
            //         case "Tangent":
            //             if(fruitsObjects[i].color === "Red") {
            //                 count++;
            //                 fruitsObjects[i].aiOutputFruit ="Apples";
            //             }
            //             else  {
            //                 if(fruitsObjects[i].color === "Yellow")count++;
            //                 fruitsObjects[i].aiOutputFruit ="Banana";
            //             }
            //
            //             break;
            //         case "Relu":
            //
            //         case "Linear":if(fruitsObjects[i].color === "Orange") {
            //             count++;
            //             fruitsObjects[i].aiOutputFruit ="Oranges";
            //         }
            //         else  {
            //             if(fruitsObjects[i].color === "Yellow")count++;
            //             fruitsObjects[i].aiOutputFruit ="Banana";
            //         }
            //
            //             break;
            //     }
            // }accuracy = count / totalNumberOfFruits * 100 ;


        }

        if ((1 - accuracy) < Goal) {
            epochBreak = true;
        }
    }

    updateAccuracy(accuracy);
    resetData(true);
    updateTable();
});

// Rest of the code remains unchanged

function sigmoidF(value) {
    let output = 1 / (1 + Math.pow(Math.E, -1 * value));
    return output;
}
function tangentF(value) {
    let output = (2 / (1 + Math.pow(Math.E, -2 * value))) - 1;
    return output;
}
function reluF(value) {
    let output = Math.max(0, value);
    return output;
}
function linearF(value) {
    let output = (value >= 0) ? value : 0;
    return output;
}


$("#btn_add").click(() => {
    // TODO: pass the expected output
    addFruit("None");
});

function resetData(clearTableOnly = false) {
    if (!clearTableOnly) {
        fruitsObjects = [];
        totalNumberOfFruits = 0;
        updateAccuracy(0);
    }
    $("#data-body").empty();
}
function addFruit(expectedFruit) {
    let realFruit = "Oranges";
    switch (colorInput) {
        case "Orange":
            realFruit = "Oranges";
            break;
        case "Yellow":
            realFruit = "Banana";
            break;
        case "Red":
            realFruit = "Apples";
    }
    let object = {
        'sweetness': sweetnessInput,
        'color': colorInput,
        'realFruit': realFruit,
        'aiOutputFruit': expectedFruit
    }
    totalNumberOfFruits++;
    fruitsObjects.push(object)
    addToTable(object);
}
function updateAccuracy(val) {
    console.log(val)
    if (val) accuracy = val;
    // TODO: loop through the fruitObjects and compare the two values
    // And you can divide the similarities on totalNumberOfFruits variable
    $("#accuracy").html("Accuracy: " + accuracy.toFixed(2) + "%");

}
function addToTable(obj) {
    const $tableBody = $("#data-body");
    $tableBody.append(`
            <tr>
                <td>${obj['sweetness']}</td>
                <td>${obj['color']}</td>
                <td>${obj['realFruit']}</td>
                <td>${obj['aiOutputFruit'] ?? "None"}</td>
            </tr>
        `);

    // updateAccuracy();

}
function updateTable() {
    fruitsObjects.forEach((obj) => {
        addToTable(obj);
    });
}

$("#input_upload").change(function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            resetData();
            const content = e.target.result;
            const lines = content.split('\n');
            let data;
            lines.forEach((line, index) => {
                if (line.length > 0) {
                    let object = {};
                    data = line.split(',');
                    object['sweetness'] = data.at(0);
                    object['color'] = data.at(1);
                    object['realFruit'] = data.at(2);
                    object['aiOutputFruit'] = null;
                    totalNumberOfFruits++;
                    fruitsObjects.push(object);
                }
            });
            updateTable();
        };

        reader.readAsText(file);
    }
    $(this).val('');
});

$("#btn_reset").click(() => resetData());

(() => {
    $("#input_activation-function").change(function () {
        activationMethod = $(this).val();
    });

    $("#input_number-of-neuron").change(function () {
        numberOfNeuron = parseInt($(this).val());
    });

    $("#input_learning-rate").change(function () {
        learningRate = parseInt($(this).val());
    });

    $("#input_epoches").change(function () {
        maxNumOfEpoches = parseInt($(this).val());
    });

    $("#input_sweetness").change(function () {
        sweetnessInput = $(this).val();
    });

    $("#input_color").change(function () {
        colorInput = $(this).val();
    });
    $("#input_goal").change(function () {
        Goal = $(this).val();
    });

})();
