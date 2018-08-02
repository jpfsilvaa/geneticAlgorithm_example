var MUTATION_RATE = 0;
var POPULATION = 0;
var PREDATION_RATE = 0;

var alphabet = [];
var indexes = [];
var lastCost = 99999;
var stop = false;

var fillAlphabet = function() {
    for(let i = 65; i <= 90; i++)
        alphabet.push(String.fromCharCode(i));
    for(let i = 97; i <= 122; i++)
        alphabet.push(String.fromCharCode(i));
    alphabet.push(" ");
}

var Gene = function(code) {
    if (code) this.code = code;
    this.cost = 9999;
};
Gene.prototype.code = '';
Gene.prototype.random = function(length) {
    while (length--) {
        this.code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
};
Gene.prototype.mutate = function(chance) {
    console.log("\n\nMUTAÇÃO");
    if (Math.random() > chance) return;

    var index = Math.floor(Math.random() * this.code.length); // as letras trocadas também são aleatórias
    var newChar = alphabet[Math.floor(Math.random() * alphabet.length)];
    var newString = '';
    for (i = 0; i < this.code.length; i++) {
        if (i == index) newString += newChar;
        else newString += this.code[i];
    }

    this.code = newString;
};
Gene.prototype.mate = function(gene) { // metodo que faz o crossover
    var pivot = Math.round(this.code.length / 2) - 1;

    var child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
    var child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);

    return [new Gene(child1), new Gene(child2)];
};
Gene.prototype.calcCost = function(compareTo) {
    var total = 0;
    for (i = 0; i < this.code.length; i++) {
        total += Math.abs(this.code.charCodeAt(i) - compareTo.charCodeAt(i));
    }
    this.cost = total;
};
var Population = function(goal, size) {
    this.members = [];
    this.goal = goal;
    this.resetCount = 0;
    this.generationNumber = 0;
    while (size--) {
        var gene = new Gene();
        gene.random(this.goal.length);
        this.members.push(gene);
    }
};

Population.prototype.fillIndexes = function() {
    for (let i = 0; i < POPULATION; i++)
        indexes.push(i);
}

Population.prototype.display = function() {
    var popList = document.getElementById("population");
    var bestPhrase = document.getElementById("best");
    var generation = document.getElementById("generation");
    //var mut_rate = document.getElementById("mut_rate");
    //var pop = document.getElementById("pop");
    //var pred_rate = document.getElementById("pred_rate");
    popList.innerHTML = '';
    //mut_rate.innerHTML = ("Taxa de mutação: <span>" + MUTATION_RATE * 100 + "%</span>");
    //pop.innerHTML = ("População: <span>" + POPULATION + " indivíduos.</span>");
    //pred_rate.innerHTML = ("Taxa de predação: <span>" + PREDATION_RATE * 100 + "%</span>");
    generation.innerHTML = ("Geração: <span>"+ this.generationNumber + "</span>");
    //document.popList.innerHTML += ("<ul>");
    for (var i = 0; i < POPULATION; i++) {
        if(i == 0)
            best.innerHTML = "MELHOR FRASE: <span>" + this.members[i].code + "</span>";
        popList.innerHTML += ("<li>" + this.members[i].code + " (" + this.members[i].cost + ")");
    }
    //document.body.innerHTML += ("</ul>");
};
Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return a.cost - b.cost;
    });
}

Population.prototype.elitism = function(elitismRate) {
    console.log("\n\nELITISMO");
    var pivot = Math.round(this.members[0].length / 2) - 1;

    for(let i = this.members.length * elitismRate; i < this.members.length; i++){
        console.log(i);
        console.log(this.members[8]);
        this.members[i] = this.members[0].code.substr(0, pivot) + this.members[i].code.substr(pivot);
    }
}

Population.prototype.crossover = function () {
    console.log("\n\nCROSSOVER");
    var cont = 0;
    var crossover_newGene = [];

    while (indexes.length > 0) {
        //console.log(indexes);
        let indexMemberOne = Math.floor(Math.random() * indexes.length);
        let memberIndex = indexes[indexMemberOne];
        indexes.splice(indexMemberOne, 1);
        let parentOne = this.members[memberIndex];
        //console.log("index parentOne -> " + memberIndex);
        //console.log(parentOne);

        let indexMemberTwo = Math.floor(Math.random() * indexes.length);
        memberIndex = indexes[indexMemberTwo];
        indexes.splice(indexMemberTwo, 1);
        let parentTwo = this.members[memberIndex];
        //console.log("index parentTwo -> " + memberIndex);
        //console.log(parentTwo);

        let children = parentOne.mate(parentTwo);

        let parentsAndChildren = [parentOne, parentTwo, children[0], children[1]];

        for (let i = 0; i < parentsAndChildren.length; i++) {
            parentsAndChildren[i].calcCost(this.goal);
        }
        parentsAndChildren.sort(function (a, b) {
            return a.cost - b.cost;
        });
        //console.log("RESULTADO DO CROSSOVER:");
        //console.log(parentsAndChildren[0]);
        //console.log(parentsAndChildren[1]);
        //this.members.splice(cont, 2, parentsAndChildren[0], parentsAndChildren[1]);
        crossover_newGene.push(parentsAndChildren[0], parentsAndChildren[1]);
        //console.log("FIM DO RESULTADO.\n\n");
    }
    this.members = crossover_newGene;
    this.sort();
    //console.log("\n");
    this.fillIndexes();
}

Population.prototype.elitism = function () {
    console.log("\n\nELITISMO");
    var cont = 0;
    var elitism_newGene = [];
    var bestCurrentMember = this.members[0];
    //console.log(bestCurrentMember);
    let children = [];
    elitism_newGene.push(bestCurrentMember);
    for (let i = 1; i < POPULATION; i++) {
        children = bestCurrentMember.mate(this.members[i]);

        children[0].calcCost(this.goal);
        children[1].calcCost(this.goal);

        children.sort(function(a, b) {
            return a.cost - b.cost;
        });

        //console.log("RESULTADO DO ELITISMO:");
        //console.log(children[0]);
        elitism_newGene.push(children[0]);
        //console.log(elitism_newGene);
        //console.log("FIM DO RESULTADO.\n\n");
    }

    //console.log(this.members);
    this.members = elitism_newGene;
    this.sort();
    //console.log(this.members);
}

Population.prototype.reset = function() {
    console.log("\n\nRESET")
    var reset_newGene = [];
    //var bestFitnessMember = [this.members[0], this.members[1], this.members[2]];

    reset_newGene.push(this.members[0], this.members[1], this.members[2]);

    for(let i = 3; i < POPULATION; i++) {
        var gene = new Gene();
        gene.random(this.goal.length);
        gene.calcCost(this.goal);
        reset_newGene.push(gene);
    }

    this.members = reset_newGene;
    console.log(this.members);
    this.elitism();
    console.log(this.members);
}

Population.prototype.predation = function(chance) {
    console.log("\n\nPREDAÇÃO");
    for (let i = 0; i < POPULATION; i++) {
        if(Math.random() < chance) {
            let gene = new Gene();
            gene.random(this.goal.length);
            gene.calcCost(this.goal);
            this.members[i] = gene;
        }
    }
}

Population.prototype.generation = function() {
    console.log(this.goal);
    for (var i = 0; i < POPULATION; i++) {
        this.members[i].calcCost(this.goal);
    }

    this.sort(); // Ordena por fitness
    this.display();

    this.predation();
    this.sort();
    this.display();

    if(this.generationNumber % 2 == 0)
        this.crossover();
    else
        this.elitism();
    this.sort();
    this.display();

    for (var i = 0; i < POPULATION; i++) {
        this.members[i].mutate(MUTATION_RATE); // Mutação
        this.members[i].calcCost(this.goal);
        if (this.members[i].code == this.goal) { // Condição de parada do algoritmo
            this.sort();
            this.display();
            console.log("------------------FIM");
            return true;
        }
    }

    if (this.resetCount >= 10) {
        this.resetCount = 0;
        this.reset();
    }
    else if (this.members[0].cost >= lastCost)
        this.resetCount++;
    else {
        this.resetCount = 0;
        lastCost = this.members[0].cost;
    }

    if(stop) {
        return true;
    }

    this.generationNumber++;
    var scope = this;
    var x = 0;
    setTimeout(function() {
        scope.generation();
    }, 20);
};

var stopProccess = function() {
    stop = true;
}

var start = function () {
    var phrase = document.getElementById("phrase").value;
    if(phrase == "")
        alert("INSIRA UMA FRASE!");
    else {
        MUTATION_RATE = document.getElementById("mut_input").value / 100;
        POPULATION = document.getElementById("pop_input").value;
        PREDATION_RATE = document.getElementById("pred_input").value / 100;
        fillAlphabet();
        var population = new Population(phrase, POPULATION);
        population.fillIndexes();
        population.generation(0);
    }
}
