/*
TODO:
Soils
More sedimentary rocks
Metamorphic rocks
	Ersatz pressure
Merge crimson?
Proper classification of limestone within these code comments
*/

var modName = "mods/the_ground.js";
var libraryMod = "mods/code_library.js";
var colorOffsetMod = "mods/maxColorOffset.js";

if(!enabledMods.includes(libraryMod)) {
	enabledMods.splice(enabledMods.indexOf(modName),0,libraryMod);
	enabledMods.splice(enabledMods.indexOf(modName),0,colorOffsetMod);
	localStorage.setItem("enabledMods", JSON.stringify(enabledMods));
	alert(`The ${libraryMod} and ${colorOffsetMod} mods are required and have been automatically inserted (reload for this to take effect).`);
} else {

//Variables
	
	//var vitreousInterfelsicName = "obsidian";
	var vitreousInterfelsicName = "dacidian";
	var vitreousIntermediateName = "andesidian";
	var vitreousMaficName = "basalidian";
	var vitreousUltramaficName = "komatidian";
	
	var sandSimplification = ["gravel","granite_gravel","granodiorite_gravel","diorite_gravel","basalt_gravel","peridotite_gravel","rhyolite_gravel","dacite_gravel","andesite_gravel","komatiite_gravel","pumice_gravel","intermediate_pumice_gravel","scoria_gravel","mafic_scoria_gravel","ultramafic_scoria_gravel", "dacidian_shard", "andesidian_shard", "basalidian_shard", "komatidian_shard"];

	var rocks = [ "granite",  "granodiorite",  "diorite",  "rock",  "peridotite",   "rhyolite",  "dacite",  "andesite",  "basalt",  "komatiite",   "pumice",  "intermediate_pumice",  "scoria",  "mafic_scoria",  "ultramafic_scoria",   "obsidian",  "dacidian",  "andesidian",  "basalidian",  "komatidian"];

	var gravels = [ "granite_gravel",  "granodiorite_gravel",  "diorite_gravel",  "gravel",  "peridotite_gravel",   "rhyolite_gravel",  "dacite_gravel",  "andesite_gravel",  "basalt_gravel",  "komatiite_gravel",   "pumice_gravel",  "intermediate_pumice_gravel",  "scoria_gravel",  "mafic_scoria_gravel",  "ultramafic_scoria_gravel",   "obsidian_shard",  "dacidian_shard",  "andesidian_shard",  "basalidian_shard",  "komatidian_shard" ];

//Functions

	//Star world matter function

		var stellarPlasmaSpreadWhitelist = ["stellar_plasma","liquid_stellar_plasma","liquid_degenerate_neutronium","gaseous_degenerate_neutronium","neutron_star"];

		function starColor(pixel) {
			if (pixel.temp < 0) { pixel.color = pixelColorPick(pixel,"#615e5e"); var c=0 }
			else if (pixel.temp < 200) { pixel.color = pixelColorPick(pixel,"#6e4c4b"); var c=0 }
			else if (pixel.temp < 400) { pixel.color = pixelColorPick(pixel,"#944340"); var c=0.00003 }
			else if (pixel.temp < 650) { pixel.color = pixelColorPick(pixel,"#d14c47"); var c=0.0001 }
			else if (pixel.temp < 900) { pixel.color = pixelColorPick(pixel,"#e35b56"); var c=0.0004 }
			else if (pixel.temp < 1300) { pixel.color = pixelColorPick(pixel,"#eb6a6a"); var c=0.001 }
			else if (pixel.temp < 1500) { pixel.color = pixelColorPick(pixel,"#f27e7e"); var c=0.0025 }
			else if (pixel.temp < 1700) { pixel.color = pixelColorPick(pixel,"#f58e8e"); var c=0.004 }
			else if (pixel.temp < 2400) { pixel.color = pixelColorPick(pixel,"#f59a9a"); var c=0.007 }
			else if (pixel.temp < 3000) { pixel.color = pixelColorPick(pixel,"#faaaaa"); var c=0.01 }
			else if (pixel.temp < 3600) { pixel.color = pixelColorPick(pixel,"#ffbdbd"); var c=0.015 }
			else if (pixel.temp < 5000) { pixel.color = pixelColorPick(pixel,"#ffd5bd"); var c=0.025 }
			else if (pixel.temp < 6000) { pixel.color = pixelColorPick(pixel,"#ffe7bd"); var c=0.035 } //new in-between state because the transition is too jarring
			else if (pixel.temp < 7000) { pixel.color = pixelColorPick(pixel,"#ffffbd"); var c=0.05 } //most of these are not real because of the kid named Planckian locus, but it makes it more fun
			else if (pixel.temp < 9000) { pixel.color = pixelColorPick(pixel,"#feffd6"); var c=0.07 }
			else if (pixel.temp < 11000) { pixel.color = pixelColorPick(pixel,"#f7fff5"); var c=0.1 }
			else if (pixel.temp < 14000) { pixel.color = pixelColorPick(pixel,"#e3fcfc"); var c=0.125 }
			else if (pixel.temp < 17000) { pixel.color = pixelColorPick(pixel,"#d1f6ff"); var c=0.15 }
			else if (pixel.temp < 20000) { pixel.color = pixelColorPick(pixel,"#d1f0ff"); var c=0.175 }
			else if (pixel.temp < 27000) { pixel.color = pixelColorPick(pixel,"#bde0ff"); var c=0.2 }
			else if (pixel.temp < 34000) { pixel.color = pixelColorPick(pixel,"#bdd3ff"); var c=0.25 }
			else if (pixel.temp < 43500) { pixel.color = pixelColorPick(pixel,"#bdc7ff"); var c=0.3 }
			else if (pixel.temp < 50000) { pixel.color = pixelColorPick(pixel,"#c3bdff"); var c=0.4 }
			else if (pixel.temp < 56000) { pixel.color = pixelColorPick(pixel,"#c3bdff"); var c=0.5 }
			else if (pixel.temp < 61000) { pixel.color = pixelColorPick(pixel,"#bba9fc"); var c=0.6 }
			else if (pixel.temp < 66000) { pixel.color = pixelColorPick(pixel,"#a590f5"); var c=0.7 }
			else if (pixel.temp < 71000) { pixel.color = pixelColorPick(pixel,"#a68af2"); var c=0.8 }
			else { pixel.color = pixelColorPick(pixel,"#a26ffc"); var c=0.9 }
			return c;
		};
		
		function starLightAndConduction(pixel,c,whitelist=["sun"]) {
			for (var i = 0; i < adjacentCoords.length; i++) {
				var x = pixel.x+adjacentCoords[i][0];
				var y = pixel.y+adjacentCoords[i][1];
				if (isEmpty(x,y)) {
					if (Math.random() <= c) {
						createPixel("light", x, y);
						pixelMap[x][y].color = pixel.color;
					};
				} else if (!outOfBounds(x,y)) {
					var newPixel = pixelMap[x][y];
					//console.log(whitelist,newPixel.element,whitelist.includes(newPixel.element));
					if (pixel.temp!==newPixel.temp && whitelist.includes(newPixel.element)) {
						var avg = (pixel.temp + newPixel.temp)/2;
						pixel.temp = avg;
						newPixel.temp = avg;
						pixelTempCheck(pixel);
						pixelTempCheck(newPixel);
					}
				}
			}
		};

		ferromagneticMaterials = ["iron", "cobalt", "nickel", "steel", "hematite"];

		if(!enabledMods.includes("mods/code_library.js")) {
			//x = real number
			//L = maximum value
			//x_0 = "the x value of the sigmoid midpoint" i.e. the x center of the bendy part
			//k = steepness
			function logisticCurve(x,L,k,x0) {
				return L/(   1 + (  Math.E ** ( -k * (x - x0) )  )   );
			};

			// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
			// Function from August Miller
			function scale (number, inMin, inMax, outMin, outMax) {
				return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
			};
		};

		function neutronStarLightAndConduction(pixel,c,whitelist=["neutron_star"]) {
			var pixelAge = pixelTicks - pixel.start;
			var coolingFactor;
			var logistic = logisticCurve(pixelAge/1000, 1, 0.6, -7.7);
			if(pixel.temp > 1000000) {
				//console.log('case 1');
				coolingFactor = logistic
			};
			if(pixel.temp <= 1000000 && pixel.temp > 100000) {
				//console.log('case 2');
				//console.log("l",logistic);
				coolingFactor = scale(pixel.temp,1000000,100000,logistic,0.99999);
				//if(pixelAge % 10 == 0 || pixel.temp < 100500) { console.log(coolingFactor) };
			};
			if(pixel.temp < 100000) {
				//console.log('case 3');
				coolingFactor = 0.99999
			};
			//console.log(coolingFactor);
			pixel.temp = ((pixel.temp + 273.15) * coolingFactor) - 273.15;
			
			for (var i = 0; i < adjacentCoords.length; i++) {
				var x = pixel.x+adjacentCoords[i][0];
				var y = pixel.y+adjacentCoords[i][1];
				if (isEmpty(x,y)) {
					if (Math.random() <= c) {
						createPixel(Math.random() < 0.995 ? "light" : "neutron", x, y);
						pixelMap[x][y].color = pixel.color;
					};
				} else if (!outOfBounds(x,y)) {
					var newPixel = pixelMap[x][y];
					//console.log(elements[newPixel.element].conduct);
					if(ferromagneticMaterials.includes(newPixel.element) && (Math.random() < 0.1)) { newPixel.charge = 20 }; //no magnetism in sb
					//console.log(whitelist,newPixel.element,whitelist.includes(newPixel.element));
					if (pixel.temp!==newPixel.temp && whitelist.includes(newPixel.element)) {
						var avg = (pixel.temp + newPixel.temp)/2;
						pixel.temp = avg;
						newPixel.temp = avg;
						pixelTempCheck(pixel);
						pixelTempCheck(newPixel);
					}
				}
			}
		};

		function almostSun(pixel,lightScale=1,whitelist=["sun"]) {
			starLightAndConduction(pixel,starColor(pixel) * lightScale,whitelist);
		};
		
		function nsTick(pixel,lightScale=1,whitelist=["sun"]) {
			neutronStarLightAndConduction(pixel,starColor(pixel) * lightScale,whitelist);
		};
		
		elements.sun.tick = function(pixel) {
			almostSun(pixel);
		};

	//"Generalized" sedimentation function

		function sedimentation(pixel,finalRock,chance=0.0003) {
			if(finalRock == undefined) { return false };
			if(Math.random() < chance) {
				var validNeighborArray = Array.apply(null, Array(adjacentCoords.length)).map(function() {return false});
				//sedimentSandstoneTries++;
				for(i = 0; i < adjacentCoords.length; i++) {
					//sedimentSandstoneTryIterations++;
					if(isEmpty(pixel.x+adjacentCoords[i][0],pixel.y+adjacentCoords[i][1],true)) {
						validNeighborArray[i] = false;
						//sedimentSandstoneNoDetects++;
					} else if(!isEmpty(pixel.x+adjacentCoords[i][0],pixel.y+adjacentCoords[i][1],true)) {
						/*if(sedimentNeighborTable.includes(pixelMap[pixel.x+adjacentCoords[i][0]][pixel.y+adjacentCoords[i][1]].element)) {
							validNeighborArray[i] = true;
							//sedimentSandstoneDetects++;
						} else {
							validNeighborArray[i] = false;
							//sedimentSandstoneNoDetects++;
						};*/
						//validNeighborArray[i] = sedimentNeighborTable.includes(pixelMap[pixel.x+adjacentCoords[i][0]][pixel.y+adjacentCoords[i][1]].element);
						validNeighborArray[i] = (pixelMap[pixel.x+adjacentCoords[i][0]][pixel.y+adjacentCoords[i][1]].state ?? "solid") == "solid";
					};
				};
				if(validNeighborArray.includes(true)) {
					//sandstoneFormations++;
					//console.log(finalRock);
					changePixel(pixel,finalRock);
				}/* else {
					sandstoneFailures++;
				}*/;
			};
		};

	//Function for mass replacement according to an object

		function transformAround(pixel,range,substitutionObject,reverse=false) {
			var radius1 = (-1 * range);
			var radius2 = (range + 1);
			for (let i = radius1; i < radius2; i++) {
				for (let j = radius1; j < radius2; j++) {
					if(reverse) {
						if (!isEmpty(pixel.x+j,pixel.y+i) && !outOfBounds(pixel.x+j,pixel.y+i)) {
							var destPixel = pixelMap[pixel.x+j][pixel.y+i];
							var elementToCheck = destPixel.element;
							if(getKeyByValue(radioactiveObject,elementToCheck)) {
								changePixel(destPixel,getKeyByValue(radioactiveObject,elementToCheck));
							};
						};
					} else {
						if (!isEmpty(pixel.x+j,pixel.y+i) && !outOfBounds(pixel.x+j,pixel.y+i)) {
							var destPixel = pixelMap[pixel.x+j][pixel.y+i];
							var elementToCheck = destPixel.element;
							if(substitutionObject[elementToCheck]) {
								changePixel(destPixel,substitutionObject[elementToCheck]);
							};
						};
					};
				};
			};
		};

	//Previous function with adjacentPixels

		function transformAdjacent(pixel,substitutionObject,reverse=false) {
			for(k = 0; k < adjacentCoords.length; k++) {
				var i = adjacentCoords[k][0]
				var j = adjacentCoords[k][1]
				if(reverse) {
					if (!isEmpty(pixel.x+j,pixel.y+i) && !outOfBounds(pixel.x+j,pixel.y+i)) {
						var destPixel = pixelMap[pixel.x+j][pixel.y+i];
						var elementToCheck = destPixel.element;
						if(getKeyByValue(radioactiveObject,elementToCheck)) {
							changePixel(destPixel,getKeyByValue(radioactiveObject,elementToCheck));
						};
					};
				} else {
					if (!isEmpty(pixel.x+j,pixel.y+i) && !outOfBounds(pixel.x+j,pixel.y+i)) {
						var destPixel = pixelMap[pixel.x+j][pixel.y+i];
						var elementToCheck = destPixel.element;
						if(substitutionObject[elementToCheck]) {
							changePixel(destPixel,substitutionObject[elementToCheck]);
						};
					};
				};
			};
		};
	
	//Cooling rate-varied magma solidification

	function magmaRateBasedCooling(pixel,freezingPoint,vitriteName,vitriteThreshold,aphaniteName,aphaniteThreshold,phaneriteName) {
		pixel.lastTemperatures ??= [];
		pixel.lastTemperatures.push(pixel.temp); //due to how it's structured, last temp will always equal pixel.temp;

		while(pixel.lastTemperatures.length > 2) {
			pixel.lastTemperatures.shift();
		};
		
		if(pixel.lastTemperatures.length > 1) {
			var overallTemperatureChangeRate = (pixel.temp - pixel.lastTemperatures[0]) / (pixel.lastTemperatures.length - 1);
			//console.log(overallTemperatureChangeRate);
			if(overallTemperatureChangeRate >= 0) {
				return;
			};
			if(pixel.temp > freezingPoint) {
				return;
			};
			//console.log(pixel.x,pixel.y,overallTemperatureChangeRate)
			if(overallTemperatureChangeRate < vitriteThreshold) { //numbers made up
				//console.log("f99fd90");
				changePixel(pixel,vitriteName,false);
			} else if(overallTemperatureChangeRate < aphaniteThreshold) {
				//console.log("aaaaaaaaaa");
				changePixel(pixel,aphaniteName,false);
			} else {
				//console.log("03");
				changePixel(pixel,phaneriteName,false);
			};
		};
	};
	
	//Gravel finder
	function getGravelElementName(rockName) {
		if(rockName == "rock") {
			return "gravel";
		};
		var gravelBasedName = rockName + "_gravel";
		if(elements[gravelBasedName]) {
			return gravelBasedName;
		};
		var shardBasedName = rockName + "_shard";
		if(elements[shardBasedName]) {
			return shardBasedName;
		};
		return false;		
	};
	
	//Sand finder
	function getSandElementName(sandName) {
		var theName = sandName;
		if(getGravelElementName(theName)) { //will fire if it was a rock with a valid gravel
			theName = getGravelElementName(theName)
		};
		if(["komatiite","peridotite","komatiite_gravel","peridotite_gravel"].includes(theName)) {
			return "olivine_sand";
		};
		if(theName == "gravel" || sandSimplification.includes(theName)) {
			return "sand";
		};
		theName = theName.replace(/(gravel|shard)/,"sand");
		if(elements[theName]) {
			return theName;
		};
		return false;
	};

	/*Metamorphism test
	function metamorphosisPressureHandler(rockBeingSquished,rockDoingSquishing) {
		pixel.lastPressures ??= [];

		while(pixel.lastPressures.length > 2) {
			pixel.lastPressures.shift();
		};

		var squisherInfo = elements[rockDoingSquishing.element];
		var squisheeInfo = elements[rockBeingSquished.element];
	
		rockBeingSquished._squishers ??= {};
		rockBeingSquished._squishers[pixelTicks] ??= {};
		rockBeingSquished._squishers[pixelTicks][`x${rockDoingSquishing.x}y${rockDoingSquishing.y}`] = (squisherInfo.density ?? 2500) + (rockDoingSquishing._receivedPressure ?? 0);
		
		rockBeingSquished._receivedPressure = sumNumericArray(Object.values(rockBeingSquished._squishers[pixelTicks]));
	
		if(squisheeInfo.metamorphismFunction) {
			squisheeInfo.metamorphismFunction(rockBeingSquished)
		};
	};	

	function removeLastSquishers(pixel) {
		if(!pixel._squishers) {
			return false;
		};
		if(pixel._squishers[pixelTicks - 1]) {
			delete pixel._squishers[pixelTicks - 1];
		};
	};
	
	elements.metal_scrap.onTryMoveInto = function(pixel,otherPixel) {
		metamorphosisPressureHandler(pixel,otherPixel);
	};

	elements.metal_scrap.tick = function(pixel) {
		removeLastSquishers(pixel);
	};
	
	elements.metal_scrap.metamorphismFunction = function(pixel) {
		pixel.temp = pixel._receivedPressure;
	};
	
	elements.metal_scrap.insulate = true;
	delete elements.metal_scrap.tempHigh;
	delete elements.metal_scrap.stateHigh;
	*/

	/*Erosion
	function toGravelErodeOtmi(pixel,otherPixel,erosionChanceDivisor=5500) {
		var gravelName = getGravelElementName(pixel.element);
		//console.log(gravelName);
		if(!gravelName) { return false };
		var otherState = elements[otherPixel.element].state ?? "solid";
		if(otherState == "solid") {
			return false;
		};
		//console.log(otherState);
		var otherDensity = elements[otherPixel.element].density ?? otherState == "gas" ? 1.3 : 1000;
		var erosionChance = ((otherState == "gas" ? otherDensity * 5 : otherDensity) ** 1/1.7) / erosionChanceDivisor;
		if(Math.random() < erosionChance) {
			changePixel(pixel,gravelName,false);
			//changePixelReturn(pixel,gravelName,false).color = "rgb(255,0,0)";
		};
	};

	function toSandErodeOtmi(pixel,otherPixel,erosionChanceDivisor=5500) {
		var sandName = getSandElementName(pixel.element);
		//console.log(sandName);
		if(!sandName) { return false };
		var otherState = elements[otherPixel.element].state ?? "solid";
		if(otherState == "solid") {
			return false;
		};
		var otherDensity = elements[otherPixel.element].density ?? otherState == "gas" ? 1.3 : 1000;
		var erosionChance = ((otherState == "gas" ? otherDensity * 5 : otherDensity) ** 1/1.7) / erosionChanceDivisor;
		if(Math.random() < erosionChance) {
			changePixel(pixel,sandName,false);
			//changePixelReturn(pixel,sandName,false).color = "rgb(255,255,0)";
		};
	};*/

	//I really hate boilerplate

		//Array maker
		
			function twoPartRepeatedArray(value1,amount1,value2,amount2) {
				var array1 = Array(amount1).fill(value1);
				var array2 = Array(amount2).fill(value2);
				return array1.concat(array2)
			};
		//Powder maker
		function newPowder(name,color,density=null,tempHigh=null,stateHigh=null,breakInto=null) { //boilerplate my dick
			if(tempHigh == null) {
				stateHigh = null;
			};
			
			elements[name] = {
				color: color,
				behavior: behaviors.POWDER,
				category: "solids",
				state: "solid",
				density: density ?? 1000,
			};
			
			if(tempHigh !== null) {
				elements[name].tempHigh = tempHigh;
			};

			if(tempHigh !== null && stateHigh !== null) {
				elements[name].stateHigh = stateHigh;
			};

			if(breakInto !== null) {
				elements[name].breakInto = breakInto;
			};
			
			return elements[name];
		};

		//Color gen
		
			//Gravels

				function gravelizeToHex(colorIn) {
					//console.log("gravelizeToHex called",colorIn);
					var colorInput = colorIn; //side effects?
					
					//make sure in is array
					if(!colorInput instanceof Array) {
						colorInput = [colorInput];
					};

					//console.log(colorInput);

					//prepare final color
					var finalColor = [];

					//console.log(colorInput);
					for(var i = 0; i < colorInput.length; i++) {
						finalColor.push(colorInput[i]);
						finalColor.push(colorInput[i]);
						finalColor.push(colorInput[i]);
					};


					//vary luminance
					for(i = 0; i < finalColor.length; i+=3) {
						finalColor[i] = changeLuminance(finalColor[i],1.25,"multiply","hsljson");
					};

					//leave offset-1 colors as-is

					for(i = 2; i < finalColor.length; i+=3) {
						finalColor[i] = changeLuminance(finalColor[i],0.85,"multiply","hsljson");
					};
					
					
					//desaturate
					for(i = 0; i < finalColor.length; i++) {
						finalColor[i] = changeSaturation(finalColor[i],0.9,"multiply","hex");
					};

					//finish
					//console.log(finalColor);
					return finalColor;
				};

			//Sands

				function sandizeToHex(rockName,type="normal",sBringTo=31,sBringFactor=0.4,lBringTo=70,lBringFactor=0.6) {
					//console.log(rockName);
					if(!["normal","n","wet","w","packed","p"].includes(type.toLowerCase())) {
						throw new Error("Type must be 'normal', 'wet', or 'packed'");
					};
					var rockInfo = elements[rockName];
					if(!rockInfo) { throw new Error("No such element '" + rockName + "'") };
					var sandColor = [];
					//var sandColorObject = [];
					var rockColor = rockInfo.color;
					if(!rockColor instanceof Array) {
						rockColor = [rockColor];
					};
					for(i = 0; i < rockColor.length; i++) {
						var colorAsHsl = normalizeColorToHslObject(rockColor[i]);
						if(colorAsHsl.s > 0) {	colorAsHsl.s = sBringTo + (-sBringFactor * (sBringTo - colorAsHsl.s)) }; //bring towards 31;
												colorAsHsl.l = lBringTo + (-lBringFactor * (lBringTo - colorAsHsl.l)); //bring towards 70
						switch(type.toLowerCase()) {
							case "normal":
							case "n":
								break;
							case "wet":
							case "w":
								if(colorAsHsl.s > 0) { colorAsHsl.s += 3 };
								colorAsHsl.l -= 15;
								break;
							case "packed":
							case "p":
								colorAsHsl.s = Math.max(colorAsHsl.s - 11, 0);
								colorAsHsl.l += 6;
								break;
							default:
								break;
						};								
						sandColor.push(convertHslObjects(colorAsHsl,"hex"));
						//sandColorObject.push(convertHslObjects(colorAsHsl,"rgbjson"));
					};

					return sandColor;
				};

				function dustizeToHex(rockName,sBringTo=25,sBringFactor=0.4,lBringTo=55,lBringFactor=0.6) {
					//console.log(rockName);
					var rockInfo = elements[rockName];
					if(!rockInfo) { throw new Error("No such element '" + rockName + "'") };
					var dustColor = [];
					//var dustColorObject = [];
					var rockColor = rockInfo.color;
					if(!rockColor instanceof Array) {
						rockColor = [rockColor];
					};
					for(i = 0; i < rockColor.length; i++) {
						var colorAsHsl = normalizeColorToHslObject(rockColor[i]);
						if(colorAsHsl.s > 0) {	colorAsHsl.s = sBringTo + (-sBringFactor * (sBringTo - colorAsHsl.s)) }; //bring towards 31;
												colorAsHsl.l = lBringTo + (-lBringFactor * (lBringTo - colorAsHsl.l)); //bring towards 70
						dustColor.push(convertHslObjects(colorAsHsl,"hex"));
						//dustColorObject.push(convertHslObjects(colorAsHsl,"rgbjson"));
					};

					return dustColor;
				};

			//Sandstones

				function sandstonizeToHex(sandName,type="normal") {
					//console.log(sandName);
					var sandInfo = elements[sandName];
					if(!sandInfo) { throw new Error("No such element '" + sandName + "'") };
					var finalColor = [];
					//var sandColorObject = [];
					var sandColor = sandInfo.color;
					if(!(sandColor instanceof Array)) {
						sandColor = [sandColor];
					};
					//console.log(sandColor);
					for(var i = 0; i < sandColor.length; i++) {
						//console.log(i,sandColor[i]);
						var colorAsHsl = normalizeColorToHslObject(sandColor[i]);
						//console.log(colorAsHsl);
						if(colorAsHsl.s > 5 && colorAsHsl.h !== 0) { colorAsHsl.h -= 10 };
						if(colorAsHsl.s > 5 && colorAsHsl.h !== 0) { colorAsHsl.s = 21 + (-0.8 * (21 - colorAsHsl.s)) }; //bring towards 21;
						colorAsHsl.l = 58 + (-0.8 * (58 - colorAsHsl.l)); //bring towards 58
						if(colorAsHsl.s > 5 && colorAsHsl.h !== 0) { colorAsHsl.s -= 4 };
						colorAsHsl.l += 2;
						//console.log(colorAsHsl);
						finalColor.push(convertHslObjects(colorAsHsl,"hex"));
						//sandColorObject.push(convertHslObjects(colorAsHsl,"rgbjson"));
					};

					return finalColor;
				};

				function sedimentHslOffset(hslJsonColor) {
					return {h: hslJsonColor.h - 4, s: hslJsonColor.s - 20, l: hslJsonColor.l - 25};
				};

			//Magmas

				function makeMoltenColor(colorIn) { //Edited vanilla code
					//console.log(colorIn);
				
					var newcolor = colorIn;
					var moltenColorFactors = [ [2,1.25,0.5], [2,1,0.5], [2,0.75,0] ];
					var colorList = [];
					var colorObjectList = [];
					// if newcolor is not an array, put it in an array
					if (!(newcolor instanceof Array)) { newcolor = [newcolor]; }
					newcolor = newcolor.map(x => convertColorFormats(x,"json"));
					// for every color in the newcolor array, add a new color with the same value, but with the r and g values increased
					for (var i = 0; i < newcolor.length; i++) {
						var c = newcolor[i];
						for (var j = 0; j < moltenColorFactors.length; j++) {
							var newc = moltenColorFactors[j];
							//console.log(c,newc);
							r = Math.floor(c.r * newc[0]);
							g = Math.floor(c.g * newc[1]);
							b = Math.floor(c.b * newc[2]);
							if (r > 255) {r = 255}; if (g > 255) {g = 255};
							//edit: to hex
							var rHex = r.toString(16); if(rHex.length == 1) { rHex = "0" + rHex };
							var gHex = g.toString(16); if(gHex.length == 1) { gHex = "0" + gHex };
							var bHex = b.toString(16); if(bHex.length == 1) { bHex = "0" + bHex };
							colorList.push("#"+rHex+gHex+bHex);
						}
					}
					return colorList;
				}
			
			//Magma vapors
				function magmavaporizeToHex(colorIn) {
					var color = colorIn;

					if(!(color instanceof Array)) {
						color = [color];
					};
					
					color = color.map(x => normalizeColorToHslObject(x));

					for(i = 0; i < color.length; i++) {
						color[i].h += 5;
						color[i].s -= 5;
						color[i].l += 20;
					};

					color = color.map(x => convertHslObjects(x,"hex"));

					return color;
				};

				function magmacloudizeToHex(colorIn) {
					var color = colorIn;

					if(!(color instanceof Array)) {
						color = [color];
					};
					
					color = color.map(x => normalizeColorToHslObject(x));

					for(i = 0; i < color.length; i++) {
						color[i].h += 5;
						color[i].s -= 8;
						color[i].l += 5;
					};

					color = color.map(x => convertHslObjects(x,"hex"));

					return color;
				};

		//Generate an entire composition family at once

		var sands = ["sand"];
		var wetSands = ["wet_sand"];
		var sandSuspensions = [];
		var sandSediments = ["radioactive_sand_sediment","clay_sediment"];
		var sandstones = ["radioactive_sandstone","shale"];
		var vaporizedMagmas = [];
		var magmaClouds = [];

		function newIgneousCompositionFamily(
			compositionFamilyName,
			magmaViscosity,
			magmaDensity,
			vitriteCoolingRateThreshold,
			aphaniteCoolingRateThreshold,
			magmaBoilingPoint,
			
			phaneriteName,
			phaneriteColor,
			phaneriteMeltingPoint,
			phaneriteDensity,
			
			aphaniteName,
			aphaniteColor,
			aphaniteMeltingPoint,
			aphaniteDensity,
			
			vesiculiteName,
			vesiculiteColor,
			vesiculiteMeltingPoint,
			vesiculiteDensity,
			
			vitriteName,
			vitriteColor,
			vitriteMeltingPoint,
			vitriteDensity,
			
			sandFormationReactionRegularSandCount,
			sandFormationReactionSpecificSandCount,
		) {
			//console.log(compositionFamilyName,vesiculiteMeltingPoint,vitriteMeltingPoint);
			
			var phaneriteSandName = compositionFamilyName == "mafic" ? "gabbro_sand" : phaneriteName + "_sand";
			
			var aphaniteSandName = aphaniteName + "_sand";
			var vesiculiteSandName = vesiculiteName + "_sand";
			var vitriteSandName = vitriteName + "_sand";
			
			var phaneriteDustName = compositionFamilyName == "mafic" ? "gabbro_dust" : phaneriteName + "_dust";
			
			var aphaniteDustName = aphaniteName + "_dust";
			var vesiculiteDustName = vesiculiteName + "_dust";
			var vitriteDustName = vitriteName + "_dust";
			
			sands.push(phaneriteSandName);
			sands.push(aphaniteSandName);
			sands.push(vesiculiteSandName);
			sands.push(vitriteSandName);
			wetSands.push("wet_" + phaneriteSandName);
			wetSands.push("wet_" + aphaniteSandName);
			wetSands.push("wet_" + vesiculiteSandName);
			wetSands.push("wet_" + vitriteSandName);

			var magmaName = compositionFamilyName + "_magma";
			if(compositionFamilyName !== "mafic") { //skip phanerite, phangravel, and aphanite for mafic rocks (rock, gravel, basalt)
				elements[phaneriteName] = {
					color: phaneriteColor,
					behavior: behaviors.POWDER,
					category: "land",
					state: "solid",
					tempHigh: phaneriteMeltingPoint,
					stateHigh: magmaName,
					density: phaneriteDensity,
					hardness: 0.75,
					breakInto: phaneriteName + "_gravel",
					_data: [compositionFamilyName,"phanerite","igneous_rock"],
				};
				
				elements.water.reactions[phaneriteName] = { "elem2": phaneriteName + "_gravel", "chance": 0.00035 }

				elements[phaneriteName + "_gravel"] = {
					color: gravelizeToHex(phaneriteColor),
					behavior: behaviors.POWDER,
					category: "land",
					state: "solid",
					tempHigh: phaneriteMeltingPoint,
					stateHigh: magmaName,
					breakInto: phaneriteDustName,
					density: phaneriteDensity * 0.55,
					_data: [compositionFamilyName,"phanerite","igneous_gravel"],
				};
				
				elements.water.reactions[phaneriteName + "_gravel"] = { "elem2": twoPartRepeatedArray(phaneriteSandName,sandFormationReactionSpecificSandCount,"sand",sandFormationReactionRegularSandCount), "chance": 0.0005 };

				elements[aphaniteName] = {
					color: aphaniteColor,
					behavior: behaviors.POWDER,
					category: "land",
					state: "solid",
					tempHigh: aphaniteMeltingPoint,
					stateHigh: magmaName,
					density: aphaniteDensity,
					hardness: 0.75,
					breakInto: aphaniteName + "_gravel",
					_data: [compositionFamilyName,"aphanite","igneous_rock"],
				};
			} else {
				phaneriteName = "rock";
				aphaniteName = "basalt";
				magmaName = "magma";
			};

			elements["solid_" + phaneriteName] = {
				color: phaneriteColor,
				behavior: behaviors.WALL,
				category: "land",
				state: "solid",
				tempHigh: phaneriteMeltingPoint,
				stateHigh: magmaName,
				density: phaneriteDensity,
				hardness: 0.8,
				breakInto: phaneriteName,
				_data: [compositionFamilyName,"phanerite","solid_igneous_rock"],
			};
			
			elements["solid_" + aphaniteName] = {
				color: aphaniteColor,
				behavior: behaviors.WALL,
				category: "land",
				state: "solid",
				tempHigh: aphaniteMeltingPoint,
				stateHigh: magmaName,
				density: aphaniteDensity,
				hardness: 0.8,
				breakInto: aphaniteName,
				_data: [compositionFamilyName,"aphanite","solid_igneous_rock"],
			};
			
			elements.water.reactions["solid_" + phaneriteName] = { "elem2": phaneriteName, "chance": 0.00035 }
			elements.water.reactions["solid_" + aphaniteName] = { "elem2": aphaniteName, "chance": 0.00035 }
			elements.water.reactions["solid_" + vesiculiteName] = { "elem2": vesiculiteName, "chance": 0.00035 }
			elements.water.reactions["solid_" + vitriteName] = { "elem2": vitriteName, "chance": 0.00035 }

			elements.water.reactions[aphaniteName] = { "elem2": aphaniteName + "_gravel", "chance": 0.00035 }
			
			elements[phaneriteSandName] = {
				color: sandizeToHex(phaneriteName,"normal"),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: phaneriteMeltingPoint,
				stateHigh: vitriteName,
				density: phaneriteDensity * 0.595,
				_data: [compositionFamilyName,"phanerite","particulate"],
			};
			
			elements[phaneriteDustName] = {
				color: dustizeToHex(phaneriteName),
				behavior: behaviors.GAS,
				category: "land",
				state: "gas",
				tempHigh: phaneriteMeltingPoint,
				stateHigh: ["fire",magmaName],
				reactions: {
					[phaneriteDustName]: {elem1: phaneriteSandName, elem2: null, chance: 0.003},
				},
				density: airDensity + (phaneriteDensity / 1000), //unmeasured value
				_data: [compositionFamilyName,"phanerite","dust"],
			};
			
			//console.log(phaneriteSandName, elements[phaneriteSandName].color);

			elements["wet_" + phaneriteSandName] = {
				color: sandizeToHex(phaneriteName,"wet"),
				behavior: behaviors.STURDYPOWDER,
				category: "land",
				reactions: {
                    "dirt": { "elem1":"sand", "elem2":"mud", "chance":0.0005, "oneway":true },
				},
				state: "solid",
                tempHigh: 100,
                stateHigh: "packed_" + phaneriteSandName,
                tempLow: -50,
                stateLow:"packed_" + phaneriteSandName,
				density: phaneriteDensity * 0.595 + 150,
				_data: [compositionFamilyName,"phanerite","wet_particulate"],
			};

			elements["packed_" + phaneriteSandName] = {
				color: sandizeToHex(phaneriteName,"packed"),
				behavior: behaviors.SUPPORT,
				category: "land",
				state: "solid",
				tempHigh: phaneriteMeltingPoint,
				stateHigh: vitriteName,
				density: phaneriteDensity * 0.59,
				breakInto: phaneriteSandName,
				_data: [compositionFamilyName,"phanerite","packed_particulate"],
			};

			elements.water.reactions[phaneriteSandName] = {
				"elem1": null, "elem2": "wet_" + phaneriteSandName,
			};
			
			elements[aphaniteName + "_gravel"] = {
				color: gravelizeToHex(aphaniteColor),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: aphaniteMeltingPoint,
				stateHigh: magmaName,
				breakInto: aphaniteDustName,
				density: aphaniteDensity * 0.55,
				_data: [compositionFamilyName,"aphanite","igneous_gravel"],
			};

			elements.water.reactions[aphaniteName + "_gravel"] = { "elem2": twoPartRepeatedArray(aphaniteSandName,sandFormationReactionSpecificSandCount,"sand",sandFormationReactionRegularSandCount), "chance": 0.0005 };

			elements[aphaniteSandName] = {
				color: sandizeToHex(aphaniteName,"normal"),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: aphaniteMeltingPoint,
				stateHigh: vitriteName,
				density: aphaniteDensity * 0.595,
				_data: [compositionFamilyName,"aphanite","particulate"],
			};

			elements[aphaniteDustName] = {
				color: dustizeToHex(aphaniteName),
				behavior: behaviors.GAS,
				category: "land",
				state: "gas",
				tempHigh: aphaniteMeltingPoint,
				stateHigh: ["fire",magmaName],
				reactions: {
					[aphaniteDustName]: {elem1: aphaniteSandName, elem2: null, chance: 0.003},
				},
				density: airDensity + (aphaniteDensity / 1000), //unmeasured value
				_data: [compositionFamilyName,"aphanite","dust"],
			};
			
			elements["wet_" + aphaniteSandName] = {
				color: sandizeToHex(aphaniteName,"wet"),
				behavior: behaviors.STURDYPOWDER,
				category: "land",
				reactions: {
                    "dirt": { "elem1":"sand", "elem2":"mud", "chance":0.0005, "oneway":true },
				},
				state: "solid",
                tempHigh: 100,
                stateHigh: "packed_" + aphaniteSandName,
                tempLow: -50,
                stateLow:"packed_" + aphaniteSandName,
				density: aphaniteDensity * 0.595 + 150,
				_data: [compositionFamilyName,"aphanite","wet_particulate"],
			};

			elements["packed_" + aphaniteSandName] = {
				color: sandizeToHex(aphaniteName,"packed"),
				behavior: behaviors.SUPPORT,
				category: "land",
				state: "solid",
				tempHigh: aphaniteMeltingPoint,
				stateHigh: vitriteName,
				density: aphaniteDensity * 0.59,
				breakInto: aphaniteSandName,
				_data: [compositionFamilyName,"aphanite","packed_particulate"],
			};

			elements.water.reactions[aphaniteSandName] = {
				"elem1": null, "elem2": "wet_" + aphaniteSandName,
			};
			
			elements[vesiculiteName] = {
				color: vesiculiteColor,
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: vesiculiteMeltingPoint,
				stateHigh: magmaName,
				density: vesiculiteDensity,
				hardness: 0.75,
				breakInto: vesiculiteName + "_gravel",
				_data: [compositionFamilyName,"vesiculite","igneous_rock"],
			};
			
			elements["solid_" + vesiculiteName] = {
				color: vesiculiteColor,
				behavior: behaviors.WALL,
				category: "land",
				state: "solid",
				tempHigh: vesiculiteMeltingPoint,
				stateHigh: magmaName,
				density: vesiculiteDensity,
				hardness: 0.8,
				breakInto: vesiculiteName,
				_data: [compositionFamilyName,"vesiculite","solid_igneous_rock"],
			};
			
			elements.water.reactions[vesiculiteName] = { "elem2": vesiculiteName + "_gravel", "chance": 0.00035 }

			elements[vesiculiteName + "_gravel"] = {
				color: gravelizeToHex(vesiculiteColor),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: vesiculiteMeltingPoint,
				stateHigh: magmaName,
				breakInto: vesiculiteDustName,
				density: vesiculiteDensity * 3.2,
				_data: [compositionFamilyName,"vesiculite","igneous_gravel"],
			};
			
			elements.water.reactions[vesiculiteName + "_gravel"] = { "elem2": twoPartRepeatedArray(vesiculiteSandName,sandFormationReactionSpecificSandCount,"sand",sandFormationReactionRegularSandCount), "chance": 0.0005 };

			elements[vesiculiteSandName] = {
				color: sandizeToHex(vesiculiteName,"normal"),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: vesiculiteMeltingPoint,
				stateHigh: vitriteName,
				density: vesiculiteDensity * 1.9,
				_data: [compositionFamilyName,"vesiculite","particulate"],
			};

			elements[vesiculiteDustName] = {
				color: dustizeToHex(vesiculiteName),
				behavior: behaviors.GAS,
				category: "land",
				state: "gas",
				tempHigh: vesiculiteMeltingPoint,
				stateHigh: ["fire",magmaName],
				reactions: {
					[vesiculiteDustName]: {elem1: vesiculiteSandName, elem2: null, chance: 0.003},
				},
				density: airDensity + (vesiculiteDensity / 800), //unmeasured value
				_data: [compositionFamilyName,"vesiculite","dust"],
			};
			
			elements["wet_" + vesiculiteSandName] = {
				color: sandizeToHex(vesiculiteName,"wet"),
				behavior: behaviors.STURDYPOWDER,
				category: "land",
				reactions: {
                    "dirt": { "elem1":"sand", "elem2":"mud", "chance":0.0005, "oneway":true },
				},
				state: "solid",
                tempHigh: 100,
                stateHigh: "packed_" + vesiculiteSandName,
                tempLow: -50,
                stateLow:"packed_" + vesiculiteSandName,
				density: vesiculiteDensity * 1.9 + 150,
				_data: [compositionFamilyName,"vesiculite","wet_particulate"],
			};

			elements["packed_" + vesiculiteSandName] = {
				color: sandizeToHex(vesiculiteName,"packed"),
				behavior: behaviors.SUPPORT,
				category: "land",
				state: "solid",
				tempHigh: vesiculiteMeltingPoint,
				stateHigh: vitriteName,
				density: vesiculiteDensity * 1.888,
				breakInto: vesiculiteSandName,
				_data: [compositionFamilyName,"vesiculite","packed_particulate"],
			};

			elements.water.reactions[vesiculiteSandName] = {
				"elem1": null, "elem2": "wet_" + vesiculiteSandName,
			};
			
			elements[vitriteName] = {
				color: vitriteColor,
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: vitriteMeltingPoint,
				stateHigh: magmaName,
				density: vitriteDensity,
				hardness: 0.75,
				breakInto: vitriteName + "_shard",
				_data: [compositionFamilyName,"vitrite","igneous_rock"],
			};

			elements["solid_" + vitriteName] = {
				color: vitriteColor,
				behavior: behaviors.SOLID,
				category: "land",
				state: "solid",
				tempHigh: vitriteMeltingPoint,
				stateHigh: magmaName,
				density: vitriteDensity,
				hardness: 0.8,
				breakInto: vitriteName,
				_data: [compositionFamilyName,"vitrite","solid_igneous_rock"],
			};
			
			elements.water.reactions[vitriteName] = { "elem2": vitriteName + "_shard", "chance": 0.00035 }

			elements[vitriteName + "_shard"] = {
				color: gravelizeToHex(vitriteColor),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: vitriteMeltingPoint,
				stateHigh: magmaName,
				breakInto: vitriteDustName,
				density: vitriteDensity * 0.55,
				_data: [compositionFamilyName,"vitrite","glass_shard"],
			};

			elements.water.reactions[vitriteName + "_shard"] = { "elem2": twoPartRepeatedArray(vitriteSandName,sandFormationReactionSpecificSandCount,"sand",sandFormationReactionRegularSandCount), "chance": 0.0005 };

			elements[vitriteSandName] = {
				color: sandizeToHex(vitriteName,"normal"),
				behavior: behaviors.POWDER,
				category: "land",
				state: "solid",
				tempHigh: vitriteMeltingPoint,
				stateHigh: vitriteName,
				density: vitriteDensity * 0.595,
				_data: [compositionFamilyName,"vitrite","particulate"],
			};

			elements[vitriteDustName] = {
				color: dustizeToHex(vitriteName),
				behavior: behaviors.GAS,
				category: "land",
				state: "gas",
				tempHigh: vitriteMeltingPoint,
				stateHigh: ["fire",magmaName],
				reactions: {
					[vitriteDustName]: {elem1: vitriteSandName, elem2: null, chance: 0.003},
				},
				density: airDensity + (vitriteDensity / 1000), //unmeasured value
				_data: [compositionFamilyName,"vitrite","dust"],
			};
			
			elements["wet_" + vitriteSandName] = {
				color: sandizeToHex(vitriteName,"wet"),
				behavior: behaviors.STURDYPOWDER,
				category: "land",
				reactions: {
                    "dirt": { "elem1":"sand", "elem2":"mud", "chance":0.0005, "oneway":true },
				},
				state: "solid",
                tempHigh: 100,
                stateHigh: "packed_" + vitriteSandName,
                tempLow: -50,
                stateLow:"packed_" + vitriteSandName,
				density: vitriteDensity * 0.595 + 150,
				_data: [compositionFamilyName,"vitrite","wet_particulate"],
			};

			elements["packed_" + vitriteSandName] = {
				color: sandizeToHex(vitriteName,"packed"),
				behavior: behaviors.SUPPORT,
				category: "land",
				state: "solid",
				tempHigh: vitriteMeltingPoint,
				stateHigh: vitriteName,
				density: vitriteDensity * 0.59,
				breakInto: vitriteSandName,
				_data: [compositionFamilyName,"vitrite","packed_particulate"],
			};

			elements.water.reactions[vitriteSandName] = {
				"elem1": null, "elem2": "wet_" + vitriteSandName,
			};
			
			if(compositionFamilyName !== "mafic") {
				elements[magmaName] = {
					"reactions": {
						"ash": { "elem1": null, "elem2": "molten_slag" },
						"dust": { "elem1": null, "elem2": "molten_slag" },
						"foam": { "elem1": vesiculiteName, "elem2": vesiculiteName },
					},
					_magmaCoolingPassToElement: {
						vitreous: [vitriteCoolingRateThreshold,vitriteName],
						aphanitic: [aphaniteCoolingRateThreshold,aphaniteName],
						phaneritic: [Infinity,phaneriteName],
						meltingPoints: {
							vitreous: vitriteMeltingPoint,
							vesicular: vesiculiteMeltingPoint,
							aphanitic: aphaniteMeltingPoint,
							phaneritic: phaneriteMeltingPoint,
						},
					},
					tick: function(pixel) {
						var coolingInfo = elements[pixel.element]._magmaCoolingPassToElement;
						magmaRateBasedCooling(
							pixel,
							Math.min(
								coolingInfo.meltingPoints.vitreous,
								coolingInfo.meltingPoints.vesicular,
								coolingInfo.meltingPoints.aphanitic,
								coolingInfo.meltingPoints.phaneritic
							) - 20,
							coolingInfo.vitreous[1],
							coolingInfo.vitreous[0],
							coolingInfo.aphanitic[1],
							coolingInfo.aphanitic[0],
							coolingInfo.phaneritic[1]
						);
					},
					"color": makeMoltenColor(phaneriteColor),
					"behavior": behaviors.MOLTEN,
					"temp": Math.max(phaneriteMeltingPoint,aphaniteMeltingPoint,vesiculiteMeltingPoint,vitriteMeltingPoint) + 100,
					"tempLow": -Infinity, //cosmetic info
					"stateLow": [aphaniteName,phaneriteName,vitriteName],
					"tempHigh": magmaBoilingPoint,
					"stateHigh": "vaporized_" + magmaName,
					"viscosity": magmaViscosity,
					"hidden": true,
					"state": "liquid",
					"category": "molten",
					"density": magmaDensity,
					"_data": [compositionFamilyName,"magma","liquid"],
				};
			} else {
				elements[magmaName].tempHigh = magmaBoilingPoint;
				elements[magmaName].stateHigh = ["vaporized_" + magmaName];
			};

			elements["vaporized_" + magmaName] = {
				color: magmavaporizeToHex(elements[magmaName].color),
				behavior: behaviors.GAS,
				density: magmaDensity * 0.0028,
				temp: magmaBoilingPoint + 100,
				tempLow: magmaBoilingPoint,
				stateLow: magmaName,
				category: "gases",
				state: "gas",
				hidden: true,
				_data: [compositionFamilyName,"magma","vaporized"],
			};
			
			vaporizedMagmas.push("vaporized_" + magmaName);
			
			elements[magmaName + "_cloud"] = {
				color: magmacloudizeToHex(elements[magmaName].color),
				behavior: [
					"XX|XX|XX",
					"M1%7|CH:" + magmaName + "%0.05|M1%7",
					"XX|XX|XX",
				],
				density: magmaDensity * 0.0021,
				temp: magmaBoilingPoint + 100,
				tempLow: Math.min(phaneriteMeltingPoint,aphaniteMeltingPoint,vesiculiteMeltingPoint,vitriteMeltingPoint) - 50,
				stateLow: aphaniteSandName,
				category: "gases",
				state: "gas",
				_data: [compositionFamilyName,"magma","cloud"],
			};

			magmaClouds.push(magmaName + "_cloud");
			
		};

		function makeSandstoningElements(sandName) {

			var sandInfo = elements[sandName];
			if(!sandInfo) {
				throw new Error("No such element '" + sandName + "'");
			};

			var suspensionName = sandName + "y_water";
			
			var wetSandName = "wet_" + sandName;
			
			var sedimentName = sandName + "_sediment";
			
			var sandstoneName = sandName + "stone";
			
			var dustName = sandName.replace("_sand","_dust");
			
			//Water reaction to pick up the fine material (this is very simplified)

				elements.water.reactions[wetSandName] = {
					"elem1": suspensionName,
					"elem2": [wetSandName,wetSandName,wetSandName,suspensionName],
					chance: 0.01
				};

			//Sediment suspension

				//Color generation
				
				var sandColor = sandInfo.color;
				if(!(sandColor instanceof Array)) {
					sandColor = [sandColor];
				};
				
				var waterColor = "#2167ff";
				
				//console.log(sandColor);
				
				suspensionColor = sandColor.map(sandSubcolor => lerpColors(waterColor,sandSubcolor,"hex",weight1=0.5)); //lerp all with half water

				var sedimentColor = sandColor.map(sandSubcolor => convertHslObjects(sedimentHslOffset(normalizeColorToHslObject(sandSubcolor)),"hex"));
				
				//console.log(sandInfo);
				
				elements[suspensionName] = {
					color: suspensionColor,
					behavior: behaviors.LIQUID,
					tempHigh: 100,
					stateHigh: ["steam","steam",sandName],
					//tempLow: 0,
					//stateLow: "sandy_ice",
					category: "liquids",
					reactions: {
						"dirt": { // React with (water reacts with dirt to make mud)
							"elem1": [null,null,wetSandName], // First element transforms into; in this case, water deletes itself
							"elem2": "mud", // Second element transforms into; in this case, dirt turns to mud
						},
						"water": { "elem1":"water", "elem2":suspensionName, "chance":0.025 }, //swap reaction
						"sand": { "elem1": [null,null,wetSandName], "elem2": wetSandName, }, 
						suspensionName: { "elem1":"water", "elem2":sedimentName, "chance": 0.001 }, 
						wetSandName: { "elem1": "water", "elem2":sedimentName, "chance": 0.0005 },
						//"salt": { "elem1": "salt_water", "elem2": null },
						//"sugar": { "elem1": "sugar_water", "elem2": null, },
						"dust": { "elem1": "dirty_water", "elem2": null, },
						"ash": { "elem1": "dirty_water", "elem2": null, },
						"cyanide": { "elem1": "dirty_water", "elem2": null, },
						//"carbon_dioxide": { "elem1": "seltzer", "elem2": null, "oneway":true },
						"sulfur": { "elem1": "dirty_water", "elem2": null, },
						"rat": { "elem1": "dirty_water", chance:0.005 },
						"plague": { "elem1": "dirty_water", "elem2": null, },
						"rust": { "elem1": "dirty_water", chance:0.005 },
						"fallout": { "elem1": "dirty_water", chance:0.25 },
						"radiation": { "elem1": "dirty_water", chance:0.25 },
						"uranium": { "elem1": "dirty_water", chance:0.25 },
						"rotten_meat": { "elem1": "dirty_water", chance:0.25 },
						"quicklime": { "elem1": [null,null,wetSandName], "elem2": "slaked_lime", },
						"rock": { "elem2": wetSandName, "chance": 0.00035 },
						"ruins": { "elem2": "rock", "chance": 0.00035 },
						"mudstone": { "elem2": "mud", "chance": 0.00035 },
						//"methane": { "elem1":"primordial_soup", "elem2":"primordial_soup", tempMin:60, charged:true },
						//"ammonia": { "elem1":"primordial_soup", "elem2":"primordial_soup", tempMin:60, charged:true },
						"fly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"firefly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"bee": { "elem2":"dead_bug", "chance":0.05, "oneway":true },
						"stink_bug": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
					},
					state: "liquid",
					density: 1000 + (sandInfo.density * 0.06),
					conduct: 0.02,
					stain: 0.01,
					_data: [sandInfo._data[0], sandInfo._data[1], "suspension"],
				}
				
				if(elements[dustName]) {
					elements[dustName].reactions ??= {};
					elements[dustName].reactions.water = {
						elem1: null, elem2: suspensionName
					};
				};

			//Sediment element where lithification code resides

				elements[sedimentName] = {
					hidden: true,
					color: sedimentColor,
					hardness: 0.2,
					tick: function(pixel) {
						if(!tryMove(pixel,pixel.x,pixel.y+1)) {
							var newPixel = pixelMap[pixel.x]?.[pixel.y+1];
							if(!newPixel) {
								return;
							};
							var newElement = newPixel.element;
							var thisSandName = pixel.element.slice(0,-9); //ABCD_sand_sediment - _sediment
							var thisWetSandName = "wet_" + thisSandName;
							var thisSuspensionName = pixel.element.slice(0,-9) + "y_water";

							var sandstoneName = thisSandName + "stone";

							if(Math.random() < 0.005 && ["sediment","wet_particulate"].includes(elements[newElement]._data?.[2])) { //0.5% chance to swap with wet
								swapPixels(pixel,newPixel);
								return;
							};
							if(Math.random() < 0.001 && elements[newElement]._data?.[2] == "particulate") { //0.1% chance to give water away
								var newWetParticulateName = elements.water.reactions[newElement].elem2;
								if(elements[thisWetSandName] && elements[newWetParticulateName]) {
									//console.log(thisSandName);
									//console.log(newWetSandName);
									changePixel(pixel,thisSandName,false);
									changePixel(newPixel,newWetParticulateName,false);
								};
							};
							if(Math.random() < 0.001 && newElement == "water") { //0.1% chance to give dissolve in water
								if(elements[thisSuspensionName]) {
									//console.log(thisSuspensionName);
									changePixel(pixel,thisSuspensionName,false);
									changePixel(newPixel,thisSuspensionName,false);
								};
							};
							if(Math.random() < 0.001 && elements[newElement]._data?.[2] == "suspension") { //0.1% chance to sediment a suspension
								var newSedimentName = elements[newPixel.element].reactions[newPixel.element].elem2;
								//console.log(newSedimentName);
								if(elements[newSedimentName]) {
									changePixel(newPixel,newSedimentName,false);
								};
							};
						};

						//console.log(sandstoneName);
						sedimentation(pixel,sandstoneName)
					},
					tempHigh: sandInfo.tempHigh,
					stateHigh: sandInfo.stateHigh,
					category: "land",
					state: "solid",
					density: elements[wetSandName].density + 150,
					breakInto: sandName,
					_data: [sandInfo._data[0], sandInfo._data[1], "sediment"],
				};

			//Final rock

				//console.log(sandName);

				elements[sandstoneName] = {
					color: sandstonizeToHex(sandName), //["#b27853", "#d1a784", "#d1a784", "#d4996e"]
					behavior: behaviors.WALL,
					tempHigh: elements[sandName].tempHigh,
					stateHigh: sandName == "sand" ? "glass" : sandName == "gabbro_sand" ? "magma" : elements[sandName.slice(0,-5)].stateHigh,
					category: "land",
					state: "solid",
					density: sandInfo.density * 1.5, //wide range
					hardness: 0.5,
					breakInto: sandName,
					maxColorOffset: 30,
					_data: [sandInfo._data[0], sandInfo._data[1]+"_sandstone", "sedimentary_rock"],
				};
		};

		function makeNonSandSedimentationElements(particulateName,suspensionName,rockName) {

			var particulateInfo = elements[particulateName];
			if(!particulateInfo) {
				throw new Error("No such element '" + particulateName + "'");
			};

			var sedimentName = particulateName + "_sediment";
			
			//Water reaction to pick up the fine material (this is very simplified)

				elements.water.reactions[particulateName] = {
					"elem1": suspensionName,
					"elem2": [particulateName,particulateName,particulateName,suspensionName],
					chance: 0.01
				};

			//Sediment suspension

				//Color generation
				
				var particulateColor = particulateInfo.color;
				if(!(particulateColor instanceof Array)) {
					particulateColor = [particulateColor];
				};
				
				var waterColor = "#2167ff";
				
				//console.log(particulateColor);
				
				suspensionColor = particulateColor.map(sandSubcolor => lerpColors(waterColor,sandSubcolor,"hex",weight1=0.5)); //lerp all with half water

				var sedimentColor = particulateColor.map(sandSubcolor => convertHslObjects(sedimentHslOffset(normalizeColorToHslObject(sandSubcolor)),"hex"));
				
				//console.log(particulateInfo);
				
				elements[suspensionName] = {
					color: suspensionColor,
					behavior: behaviors.LIQUID,
					tempHigh: 100,
					stateHigh: ["steam","steam",particulateName],
					category: "liquids",
					reactions: {
						"dirt": { // React with (water reacts with dirt to make mud)
							"elem1": [null,null,particulateName], // First element transforms into; in this case, water deletes itself
							"elem2": "mud", // Second element transforms into; in this case, dirt turns to mud
						},
						"water": { "elem1":"water", "elem2":suspensionName, "chance":0.025 }, //swap reaction
						"particulateName": { "elem1": [null,null,particulateName], "elem2": particulateName, }, 
						//"salt": { "elem1": "salt_water", "elem2": null },
						//"sugar": { "elem1": "sugar_water", "elem2": null, },
						"dust": { "elem1": "dirty_water", "elem2": null, },
						"ash": { "elem1": "dirty_water", "elem2": null, },
						"cyanide": { "elem1": "dirty_water", "elem2": null, },
						//"carbon_dioxide": { "elem1": "seltzer", "elem2": null, "oneway":true },
						"sulfur": { "elem1": "dirty_water", "elem2": null, },
						"rat": { "elem1": "dirty_water", chance:0.005 },
						"plague": { "elem1": "dirty_water", "elem2": null, },
						"rust": { "elem1": "dirty_water", chance:0.005 },
						"fallout": { "elem1": "dirty_water", chance:0.25 },
						"radiation": { "elem1": "dirty_water", chance:0.25 },
						"uranium": { "elem1": "dirty_water", chance:0.25 },
						"rotten_meat": { "elem1": "dirty_water", chance:0.25 },
						"quicklime": { "elem1": [null,null,particulateName], "elem2": "slaked_lime", },
						"rock": { "elem2": particulateName, "chance": 0.00035 },
						"ruins": { "elem2": "rock", "chance": 0.00035 },
						"mudstone": { "elem2": "mud", "chance": 0.00035 },
						//"methane": { "elem1":"primordial_soup", "elem2":"primordial_soup", tempMin:60, charged:true },
						//"ammonia": { "elem1":"primordial_soup", "elem2":"primordial_soup", tempMin:60, charged:true },
						"fly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"firefly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"bee": { "elem2":"dead_bug", "chance":0.05, "oneway":true },
						"stink_bug": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
					},
					state: "liquid",
					density: 1000 + (particulateInfo.density * 0.06),
					conduct: 0.02,
					stain: 0.01,
					_data: [particulateInfo._data[0], particulateInfo._data[1], "suspension"],
				}
				
				elements[suspensionName].reactions[suspensionName] = { "elem1":"water", "elem2":sedimentName, "chance": 0.001 }, 
				elements[suspensionName].reactions[particulateName] = { "elem1": "water", "elem2":sedimentName, "chance": 0.0005 },

			//Sediment element where lithification code resides

				elements[sedimentName] = {
					hidden: true,
					color: sedimentColor,
					hardness: 0.2,
					tick: function(pixel) {
						if(!tryMove(pixel,pixel.x,pixel.y+1)) {
							var newPixel = pixelMap[pixel.x]?.[pixel.y+1];
							if(!newPixel) {
								return;
							};
							var newElement = newPixel.element;

							var particulateName = pixel.element.slice(0,-9); //ABCD_sand_sediment - _sediment

							var thisSuspensionName = elements[pixel.element]._sedimentationPassToElement.correspondingSuspension
							var rockName = elements[pixel.element]._sedimentationPassToElement.finalRock;

							if(Math.random() < 0.005 && ["sediment","wet_particulate"].includes(elements[newElement]._data?.[2])) { //0.5% chance to swap with wet
								swapPixels(pixel,newPixel);
								return;
							};
							if(Math.random() < 0.001 && elements[newElement]._data?.[2] == "particulate") { //0.1% chance to give water away
							
								var newWetParticulateName = elements.water.reactions[newElement].elem2;
								if(elements[particulateName] && elements[newWetParticulateName]) {
									changePixel(pixel,particulateName,false);
									changePixel(newPixel,newWetParticulateName,false);
								};
							};
							if(Math.random() < 0.001 && newElement == "water") { //0.1% chance to dissolve in water
								if(elements[thisSuspensionName]) {
									//console.log(thisSuspensionName);
									changePixel(pixel,thisSuspensionName,false);
									changePixel(newPixel,thisSuspensionName,false);
								};
							};
							if(Math.random() < 0.001 && elements[newElement]._data?.[2] == "suspension") { //0.1% chance to sediment a suspension
								//new sediment should be the elem2 of a suspension's reaction with itself
								var newSedimentName = elements[newPixel.element].reactions[newPixel.element].elem2;
								//console.log(newSedimentName);
								if(elements[newSedimentName]) {
									changePixel(newPixel,newSedimentName,false);
								};
							};
						};

						//console.log(rockName);
						sedimentation(pixel,rockName)
					},
					tempHigh: particulateInfo.tempHigh,
					stateHigh: particulateInfo.stateHigh,
					_sedimentationPassToElement: {
						finalRock: rockName,
						correspondingSuspension: suspensionName,
					},
					category: "land",
					state: "solid",
					density: elements[particulateName].density + 150,
					breakInto: particulateName,
					_data: [particulateInfo._data[0], particulateInfo._data[1], "sediment"],
				};

			//Final rock

				//console.log(particulateName);

				if(rockName !== "limestone") {
					elements[rockName] = {
						color: sandstonizeToHex(particulateName), //["#b27853", "#d1a784", "#d1a784", "#d4996e"]
						behavior: behaviors.WALL,
						tempHigh: particulateInfo.tempHigh,
						stateHigh: particulateInfo.stateHigh, 
						category: "land",
						state: "solid",
						density: particulateInfo.density * 1.5, //wide range
						hardness: 0.7,
						breakInto: particulateName,
						maxColorOffset: 30,
						_data: [particulateInfo._data[0], "rock", "sedimentary_rock"],
					};
				};
		};

		newPowder("calcite","#f5ecd0",2711,825,["carbon_dioxide","quicklime"],"calcium_carbonate_dust");
		newPowder("aragonite","#e3c58d",2830,825,["carbon_dioxide","quicklime"],"calcium_carbonate_dust");
		newPowder("vaterite","#e8ebd8",2540,825,["carbon_dioxide","quicklime"],"calcium_carbonate_dust");
		newPowder("calcium_carbonate_dust","#f7f7f5",2930,825,["carbon_dioxide","quicklime"]);
		
		elements.calcite._data = ["calcium","calcium","mineral"];
		elements.aragonite._data = ["calcium","calcium","mineral"];
		elements.vaterite._data = ["calcium","calcium","mineral"];
		elements.calcium_carbonate_dust._data = ["calcium","calcium","particulate"];
		elements.limestone._data = ["calcium", "rock", "sedimentary_rock"];
		
		elements.aragonite.tick = function(pixel) {
			if(Math.random() < (0.001 + Math.max(0,(pixel.temp - 300) / 100))) {
				changePixel(pixel,"calcite",false);
			};
		};
		
		elements.vaterite.tick = function(pixel) {
			if(Math.random() < (0.01 + Math.max(0,(pixel.temp - 30) / 10))) {
				changePixel(pixel,"calcite",false);
			};
		};
		
		makeNonSandSedimentationElements("calcium_carbonate_dust","calcium_carbonate_solution","limestone")

		var calcitoids = ["calcite","aragonite","vaterite"];
		for(i = 0; i < calcitoids.length; i++) {
			var mineral = calcitoids[i];
			elements.water.reactions[mineral] = {
				"elem1":"calcium_carbonate_solution",
				"elem2":[mineral,mineral,mineral,"calcium_carbonate_solution"],
				"chance":0.004
			};

			elements.seltzer.reactions[mineral] = {
				"elem1":"calcium_carbonate_solution",
				"elem2":[mineral,mineral,mineral,"calcium_carbonate_solution"],
				"chance":0.02
			};
		};

		runAfterLoad(function() {
			for(i = 0; i < sands.length; i++) {
				sandSuspensions.push(sands[i] + "y_water");
				sandSediments.push(sands[i] + "_sediment");
				sandstones.push(sands[i] + "stone");
				
				makeSandstoningElements(sands[i]);
			};
			
			elements.clay._data = ["clay","clay","particulate"],
			makeNonSandSedimentationElements("clay","clay_water","shale");
			elements.shale.color = ["#787b80","#535557","#695e58", "#696969", "#6b5d5b"];
			elements.shale.maxColorOffset = 15;
			elements.shale.tempHigh = 200; //shale does get baked (https://pubs.usgs.gov/pp/0108a/report.pdf), but it feels wrong for it to happen so soon
			elements.shale.behavior = behaviors.POWDER;
			
			for(fei = 0; fei < sandSuspensions.length; fei++) {
				var suspensionToAddReactionTo = sandSuspensions[fei];
				//console.log(suspensionToAddReactionTo);
				elements[suspensionToAddReactionTo].reactions ??= {};
				for(sei = 0; sei < sandSuspensions.length; sei++) {
					var suspensionToReactWith = sandSuspensions[sei];
					var firstSedimentName = suspensionToAddReactionTo.replace("y_water","_sediment");
					var secondSedimentName = suspensionToReactWith.replace("y_water","_sediment");
					elements[suspensionToAddReactionTo].reactions[suspensionToReactWith] = {
						elem1: "water", "elem2": [firstSedimentName,secondSedimentName], "chance": 0.001, 
					};
				};

				for(sej = 0; sej < wetSands.length; sej++) {
					var wetSandToReactWith = wetSands[sej];
					var firstSedimentName = suspensionToAddReactionTo.replace("y_water","_sediment");
					var secondSedimentName = wetSandToReactWith.replace("wet_","") + "_sediment";
					elements[suspensionToAddReactionTo].reactions[wetSandToReactWith] = {
						elem1: "water", "elem2": [firstSedimentName,secondSedimentName], "chance": 0.0005,
					};
				};
			};

			//lithificationElements = sandSediments.concat(sandstones);
			
			for(fei = 0; fei < vaporizedMagmas.length; fei++) {
				var vaporToAddReactionTo = vaporizedMagmas[fei];
				//console.log(vaporToAddReactionTo);
				elements[vaporToAddReactionTo].reactions ??= {};
				for(sei = 0; sei < vaporizedMagmas.length; sei++) {
					var vaporToReactWith = vaporizedMagmas[sei];
					var firstCloudName = vaporToAddReactionTo.replace("vaporized_","") + "_cloud";
					var secondCloudName = vaporToReactWith.replace("vaporized_","") + "_cloud";
					elements[vaporToAddReactionTo].reactions[vaporToReactWith] = {
						elem1: null, "elem2": [firstCloudName,secondCloudName], "chance": 0.3, y: [0,15] 
					};
				};

				for(sej = 0; sej < magmaClouds.length; sej++) {
					var cloudToReactWith = magmaClouds[sej];
					var firstCloudName = vaporToAddReactionTo.replace("vaporized_","") + "_cloud";
					elements[vaporToAddReactionTo].reactions[cloudToReactWith] = {
						elem1: firstCloudName, "chance": 0.4, y: [0,15]
					};
				};
			};
			
			elements.felsic_magma.reactions ??= {};
			elements.felsic_magma.reactions.intermediate_magma = {
				elem1: "intermediate_felsic_magma", elem2: "intermediate_felsic_magma", chance: 0.8,
			};

			elements.intermediate_felsic_magma.reactions ??= {};
			elements.intermediate_felsic_magma.reactions.magma = {
				elem1: "intermediate_magma", elem2: "intermediate_magma", chance: 0.7,
			};

			elements.felsic_magma.reactions ??= {};
			elements.felsic_magma.reactions.magma = { //mafic magma
				elem1: "intermediate_magma", elem2: "intermediate_magma", chance: 0.7,
			};

			elements.felsic_magma.reactions ??= {};
			elements.felsic_magma.reactions.ultramafic_magma = { //mafic magma
				elem1: "intermediate_magma", elem2: "magma", chance: 0.6,
			};

			elements.intermediate_magma.reactions ??= {};
			elements.intermediate_magma.reactions.ultramafic_magma = { //mafic magma
				elem1: "magma", elem2: "magma", chance: 0.6,
			};
			
			elements.molten_dirt.tempHigh = 3313;
			var rockStateHigh = JSON.parse(JSON.stringify(vaporizedMagmas));
			if(rockStateHigh.includes("vaporized_nellish_magma")) { 
				rockStateHigh.splice(rockStateHigh.indexOf("vaporized_nellish_magma"));
			};
			elements.molten_dirt.stateHigh = rockStateHigh; //assuming mixture
		});

//Terrain

	//Soils
	
		//Dry
		//Warning: Crippling lack of online information on the properties of the various soils by texture
		
			//Clay
			
				//Clay exists
			
			//Silty clay
				
				//TODO
				
			//Silty Clay Loam
				
				//TODO
				
			//Silty Loam
				
				//TODO
				
			//Silt
			
				//TODO
				
			//Clay Loam
			
				//TODO
				//elements.clay_soil.name = "Clay Loam"
				
			//Medium Loam
				
				//TODO
				//elements.dirt.name = "Medium Loam";
				
			//Sandy Clay
			
				/*elements.sandy_clay = {
					color: "#DDCD8A",
					behavior: behaviors.POWDER,
					tempHigh: 1710,
					tempLow: -50,
					stateLow: "sandy_clay_permafrost",
					category:"land",
					state: "solid",
					density: 1220,
				};*/
				
			//Sandy Clay Loam
			
				//TODO
				
			//Sandy Loam
			
				//TODO
				
			//Loamy Sand
			
				//TODO
				
			//Sand
			
				//Sand exists
				
		//Wet
		
			//Wet Clay
			
				//TODO
			
			//Wet Silty clay
				
				//TODO
				
			//Wet Silty Clay Loam
				
				//TODO
				
			//Wet Silty Loam
				
				//TODO
				
			//Wet Silt
			
				//TODO
				
			//Wet Clay Loam
			
				//TODO
				
			//Wet Medium Loam
				
				//Mud exists
				
			//Wet Sandy Clay
			
				//TODO
				
			//Wet Sandy Clay Loam
			
				//TODO
				
			//Wet Sandy Loam
			
				//TODO
				
			//Wet Loamy Sand
			
				//TODO
				
			//Wet Sand
			
				//Wet Sand exists
				
		//Permafrost

			//Clay Permafrost
			
				//TODO
			
			//Silty clay Permafrost
				
				//TODO
				
			//Silty Clay Loam Permafrost
				
				//TODO
				
			//Silty Loam Permafrost
				
				//TODO
				
			//Silt Permafrost
			
				//TODO
				
			//Clay Loam Permafrost
			
				//TODO
				
			//Medium Loam Permafrost
				
				//Permafrost exists
				
			//Sandy Clay Permafrost
			
				//TODO
				
			//Sandy Clay Loam Permafrost
			
				//TODO
				
			//Sandy Loam Permafrost
			
				//TODO
				
			//Loamy Sand Permafrost
			
				//TODO
				
			//Sand Permafrost
			
				//TODO

		//Radioactive (unmoved/TODO)
	
			//Dry
			
				//Radioactive Clay
				
					//Clay exists
				
				//Radioactive Silty clay
					
					//TODO
					
				//Radioactive Silty Clay Loam
					
					//TODO
					
				//Radioactive Silty Loam
					
					//TODO
					
				//Radioactive Silt
				
					//TODO
					
				//Radioactive Clay Loam
				
					//Clay Soil exists
					
				//Radioactive Medium Loam
					
					//Dirt exists
					
				//Radioactive Sandy Clay
				
					//TODO
					
				//Radioactive Sandy Clay Loam
				
					//TODO
					
				//Radioactive Sandy Loam
				
					//TODO
					
				//Radioactive Loamy Sand
				
					//TODO
					
				//Radioactive Sand
				
					//Sand exists
					
			//Wet
			
				//Radioactive Wet Clay
				
					//TODO
				
				//Radioactive Wet Silty clay
					
					//TODO
					
				//Radioactive Wet Silty Clay Loam
					
					//TODO
					
				//Radioactive Wet Silty Loam
					
					//TODO
					
				//Radioactive Wet Silt
				
					//TODO
					
				//Radioactive Wet Clay Loam
				
					//TODO
					
				//Radioactive Wet Medium Loam
					
					//Mud exists
					
				//Radioactive Wet Sandy Clay
				
					//TODO
					
				//Radioactive Wet Sandy Clay Loam
				
					//TODO
					
				//Radioactive Wet Sandy Loam
				
					//TODO
					
				//Radioactive Wet Loamy Sand
				
					//TODO
					
				//Radioactive Wet Sand
				
					//Wet Sand exists

			//Permafrost
					
				//Radioactive Clay Permafrost
				
					//TODO
				
				//Radioactive Silty clay Permafrost
					
					//TODO
					
				//Radioactive Silty Clay Loam Permafrost
					
					//TODO
					
				//Radioactive Silty Loam Permafrost
					
					//TODO
					
				//Radioactive Silt Permafrost
				
					//TODO
					
				//Radioactive Clay Loam Permafrost
				
					//TODO
					
				//Radioactive Medium Loam Permafrost
					
					//Permafrost exists
					
				//Radioactive Sandy Clay Permafrost
				
					//TODO
					
				//Radioactive Sandy Clay Loam Permafrost
				
					//TODO
					
				//Radioactive Sandy Loam Permafrost
				
					//TODO
					
				//Radioactive Loamy Sand Permafrost
				
					//TODO
					
				//Radioactive Sand Permafrost
				
					//TODO

	//Rocks
	
		//Igneous

			//Felsic

				newIgneousCompositionFamily(
					"felsic",
					1e12,
					2200,
					-85,
					-20,
					2850,
					
					"granite",
					["#F3C3AD", "#F0AB75", "#DDA888", "#BD927E", "#998473", "#5C5E53", "#BD8366"],
					1215,
					2691,
					
					"rhyolite",
					["#A67153","#BF967E","#D9B5A0","#8C533E","#C99F86","#C5997E","#BB8A69"],
					800,
					1254,
					
					"pumice",
					["#ebe1c3", "#ada386", "#f0bd9e", "#ab846c", "#bfbebd", "#75726f", "#f5e595", "#ab9e60", "#ad683d", "#633d25", "#6e6d6d", "#3b3a39"],
					1350,
					641,
					
					"obsidian",
					["#252422", "#171616", "#161915", "#161018"],
					1000,
					2488,
					
					7,3
				);
				
				elements.water.reactions.obsidian_shard.elem2 = ["obsidian_sand","obsidian_sand","obsidian_sand","sand","sand"]
				elements.obsidian_sand.color = ["#3b3730", "#211e1e", "#293321", "#31133b"];

			//Intermediate felsic

				newIgneousCompositionFamily(
					"intermediate_felsic",
					1e10,
					2320,
					-95,
					-23,
					2900,
					
					"granodiorite",
					["#B1AB9D", "#262001", "#A6A292", "#D6C5BC", "#F2F2F2", "#DED8C2", "#978871", "#A8AAA7"], //From image: By Rudolf Pohl - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=7788350
					1277, //made-up/interpolated from granite and diorite
					2644, //last 2 digits made up again
					
					"dacite",
					["#D9CCC5", "#F2E9E4", "#877670", "#A69B97"],
					1050,
					2654, //https://books.google.ca/books?id=ObUPAAAAIAAJ&pg=PA181&lpg=PA181&dq=dacite+specific+gravity&source=bl&ots=qn8B4sirWi&sig=Wp_MHqPuUGPNQobcuNP5c5wqkpU&hl=en&sa=X&ei=cimtUaH8Eab7yAH8joDABQ#v=onepage&q=dacite%20specific%20gravity&f=false
					
					"intermediate_pumice",
					["#dbd4bd", "#b5ad94", "#e3ceb6", "#bda891", "#c2c2c2", "#a1a1a1", "#e6c8a1", "#b8a48c"],
					1190,
					991,
					
					vitreousInterfelsicName,
					["#4f4b42", "#474646", "#4a4d49", "#342f36"],
					1040,
					2640,
					
					6,4
				);

			//Intermediate

				newIgneousCompositionFamily(
					"intermediate",
					1e8,
					2450,
					-105,
					-26,
					2950,
					
					"diorite",
					["#E1E1E1","#B0A696","#707271","#434459","#242424"], //Extracted from image and blended; Michael C. Rygel - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=31124755 https://commons.wikimedia.org/w/index.php?curid=7788350
					1300,
					2822, //last 2 digits made up again
					
					"andesite",
					["#6F7575", "#C5C9CB", "#818787", "#797F7F", "#B5B9BA", "#6D7371", "#909696"],
					1215,
					2474, //https://books.google.ca/books?id=ObUPAAAAIAAJ&pg=PA181&lpg=PA181&dq=dacite+specific+gravity&source=bl&ots=qn8B4sirWi&sig=Wp_MHqPuUGPNQobcuNP5c5wqkpU&hl=en&sa=X&ei=cimtUaH8Eab7yAH8joDABQ#v=onepage&q=dacite%20specific%20gravity&f=false
					
					"scoria",
					["#594545", "#573b31", "#522e28"],
					1085,
					2550,
					
					vitreousIntermediateName,
					["#636059", "#707070", "#5f615f", "#504b52"],
					1085,
					2710,
					
					5,5
				);
				
				elements.scoria_gravel.density = 2790;
			
			//Mafic

				elements.rock.name = "Gabbro";
				elements.rock.tempHigh = 1200;
				elements.rock.density = 3300;
				elements.rock.breakInto = ["gravel"];
				elements.gravel.breakInto = ["gabbro_dust"];
				elements.gravel.name = "Gabbro Gravel";
				delete elements.wet_sand.reactions.gravel;
				elements.rock._data = ["mafic","phanerite","igneous_rock"],

				elements.magma.name = "mafic magma";
				elements.magma.density = 2650;
				elements.magma._magmaCoolingPassToElement = {
					vitreous: [-115,"basalidian"],
					aphanitic: [-29,"basalt"],
					phaneritic: [Infinity,"gabbro"],
					meltingPoints: {
						vitreous: 1200,
						vesicular: 1298,
						aphanitic: 1122,
						phaneritic: 1200,
					},
				},

				elements.magma.tick = function(pixel) {
					magmaRateBasedCooling(pixel,1180,vitreousMaficName,-115,"basalt",-29,"rock");
				};
				elements.magma.temp = 1400;
				elements.magma.tempLow = -Infinity;
				elements.magma.stateLow = ["basalt","gabbro",vitreousMaficName]
				elements.magma.reactions ??= {};
				elements.magma.reactions.foam = { "elem1": "mafic_scoria", "elem2": "mafic_scoria" };
				elements.magma._data = ["mafic","magma","liquid"],

				elements.basalt.tempHigh = 1122;
				elements.basalt.density = 2949;
				elements.basalt.breakInto = "basalt_gravel",
				elements.rock._data = ["mafic","phanerite","igneous_rock"],
				elements.gravel._data = ["mafic","phanerite","igneous_gravel"],
				elements.basalt._data = ["mafic","aphanite","igneous_rock"],
				elements.sand._data = ["silica","silica","particulate"],
				elements.wet_sand._data = ["silica","silica","wet_particulate"],
				elements.packed_sand._data = ["silica","silica","packed_particulate"],

				newIgneousCompositionFamily(
					"mafic",
					10000,
					2200,
					-115,
					-29,
					3000,
					
					"rock",
					["#808080","#4f4f4f","#949494"],
					1474,
					3300,
					
					"basalt",
					["#2e2e2e","#333333","#3d3d3d"],
					1122,
					2949,
					
					"mafic_scoria",
					["#756666", "#695751", "#737272"],
					1298,
					2717,
					
					vitreousMaficName,
					["#6e615d", "#706767", "#6a6b63", "#6e5e68"],
					1200,
					2900,
					
					3,7
				);

				elements.mafic_scoria.tempHigh = 1298;
				elements.mafic_scoria.stateHigh = "magma";
				elements.mafic_scoria_gravel.density = 2993;

			//Ultramafic

				newIgneousCompositionFamily(
					"ultramafic",
					800,
					2800,
					-125,
					-32,
					3050,
					
					"peridotite",
					["#908557","#A29E78","#7F8044","#C6BC87","#8C8656","#7C7C40","#837840","#8B8B69"],
					1400,
					3347, //appr from https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/GL003i009p00509#:~:text=Abstract,and%20the%20bulk%20rock%20analyses.
					
					"komatiite",
					["#AEB5AE","#A9B8B5","#7B8881","#858B87","#949F97","#505B55"],
					1600,
					3100, 
					
					"ultramafic_scoria",
					["#737565", "#7a7761", "#727372"],
					1400,
					2924,
					
					vitreousUltramaficName,
					["#6e6d5e", "#626659", "#54574b", "#665d55"],
					1300,
					3200,
					
					2,8
				);
				
				elements.ultramafic_scoria_gravel.density = 3132;
				elements.basalt_gravel._data = ["mafic","aphanite","igneous_gravel"],
			
				elements.limestone_gravel = {
					color: ["#c7baa1", "#e8d8b7", "#fcf3d7", "#fffce6"],
					behavior: behaviors.POWDER,
					tempHigh: 825,
					stateHigh: "quicklime",
					category: "land",
					state: "solid",
					density: 1380,
					hardness: 0.16,
					breakInto: ["quicklime","calcium","dust"],
				}

				elements.limestone.breakInto = "limestone_gravel";

				elements.worm.reactions.limestone_gravel = { "elem2":"calcium", "chance":0.1 },
				elements.acid.reactions.limestone_gravel = { "elem1":"neutral_acid", "elem2":null },

				newPowder("aluminum_oxide","#f2f2f2",3987,2072).hardness = 0.93;
				
				elements.molten_aluminum_oxide = {
					tempHigh: 2977,
				};
				
				newPowder("sulfur_trioxide","#ededed",1995,16.9).reactions = {
					water: { elem1: "acid", elem2: "acid" }, //no H2SO4, hydronium doesn't really seem to be its own substance
					steam: { elem1: "acid", elem2: "acid" },
					ice: { elem1: "acid", elem2: "acid" },
					snow: { elem1: "acid", elem2: "acid" },
					packed_snow: { elem1: "acid", elem2: "acid" },
					slush: { elem1: "acid", elem2: "acid" },
				};
				
				elements.molten_sulfur_trioxide = {
					color: "#c0c0c0",
					behavior: behaviors.LIQUID,
					density: 1920,
					viscosity: 5, //idk idc
					tempHigh: 45,
					reactions: {
						water: { elem1: "acid", elem2: "acid" }, //no H2SO4, hydronium doesn't really seem to be its own substance
						steam: { elem1: "acid", elem2: "acid" },
						ice: { elem1: "acid", elem2: "acid" },
						snow: { elem1: "acid", elem2: "acid" },
						packed_snow: { elem1: "acid", elem2: "acid" },
						slush: { elem1: "acid", elem2: "acid" },
					},
				};

				elements.sulfur_trioxide_gas = {
					color: "#c0c0c0",
					density: 2.3, //idk idc
					reactions: {
						water: { elem1: "acid", elem2: "acid" }, //no H2SO4, hydronium doesn't really seem to be its own substance
						steam: { elem1: "acid", elem2: "acid" },
						ice: { elem1: "acid", elem2: "acid" },
						snow: { elem1: "acid", elem2: "acid" },
						packed_snow: { elem1: "acid", elem2: "acid" },
						slush: { elem1: "acid", elem2: "acid" },
					},
				};
				
				var tempaaa = {
					sulfur_trioxide: "value doesn't matter",
					molten_sulfur_trioxide: "stan loona",
					sulfur_trioxide_gas: "aaaaaaa"
				};
				
				delete elements.concrete.tempHigh;
				delete elements.concrete.stateHigh;
				if(elements.hanging_concrete) {
					delete elements.hanging_concrete.tempHigh;
					delete elements.hanging_concrete.stateHigh;
				};
				if(elements.crumbling_concrete) {
					delete elements.crumbling_concrete.tempHigh;
					delete elements.crumbling_concrete.stateHigh;
				};
				if(elements.attach_concrete) {
					delete elements.attach_concrete.tempHigh;
					delete elements.attach_concrete.stateHigh;
				};
				delete elements.quicklime.stateHigh;
				elements.quicklime.tempHigh = 2572;
				elements.molten_quicklime = {
					tempHigh: 2850
				};
				elements.concrete.properties ??= {};
				elements.concrete.properties.composition = "mafic";
				elements.concrete.tick = function(pixel) {
					pixel.composition ??= "mafic";
					pixel.didColorChange ??= 0;
					
					var magmaName = (pixel.composition == "mafic") ? "magma" : pixel.composition + "_magma";
					var magmaTempHigh = Math.max(...Object.values(elements[magmaName]._magmaCoolingPassToElement.meltingPoints));

					//console.log(pixel.temp,pixel.didColorChange);
					if(pixel.temp > 400 && pixel.didColorChange < 1) {
						if(Math.random() < 0.02) { breakPixel(pixel) };
						var colorWasHSL = pixel.color.startsWith("hsl");
						var oldColor = convertHslObjects(normalizeColorToHslObject(pixel.color),"rgbjson");
						oldColor.r += 81/2;
						oldColor.g += 60/2;
						oldColor.b += 56/2;
						pixel.color = convertHslObjects(normalizeColorToHslObject(oldColor),colorWasHSL ? "hsl" : "rgb");
						pixel.didColorChange = 1;
					} else if(pixel.temp > 600 && pixel.didColorChange < 2) {
						if(Math.random() < 0.04) { breakPixel(pixel) };
						var colorWasHSL = pixel.color.startsWith("hsl");
						var oldColor = convertHslObjects(normalizeColorToHslObject(pixel.color),"rgbjson");
						oldColor.r += 81/4;
						oldColor.g += 60/4;
						oldColor.b += 56/4;
						pixel.color = convertHslObjects(normalizeColorToHslObject(oldColor),colorWasHSL ? "hsl" : "rgb");
						pixel.didColorChange = 2;
					} else if(pixel.temp > 800 && pixel.didColorChange < 3) {
						if(Math.random() < 0.06) { breakPixel(pixel) };
						var colorWasHSL = pixel.color.startsWith("hsl");
						var oldColor = convertHslObjects(normalizeColorToHslObject(pixel.color),"rgbjson");
						oldColor.r += 81/4;
						oldColor.g += 60/4;
						oldColor.b += 56/4;
						pixel.color = convertHslObjects(normalizeColorToHslObject(oldColor),colorWasHSL ? "hsl" : "rgb");
						pixel.didColorChange = 3;
					};
										
					pixel.role ??= randomChoice(["aggregate","aggregate","aggregate","aggregate","sand","sand","cement"]);
					if(pixel.role == "cement") {
						var chooserValue = Math.random();
						if(chooserValue < 0.65) {
							pixel.role = "lime";
						} else if(chooserValue < 0.85) {
							pixel.role = "silica";
						} else if(chooserValue < 0.91) {
							pixel.role = "alumina";
						} else if(chooserValue < 0.96) {
							pixel.role = "ferricOxide";
						} else {
							pixel.role = "sulfurTrioxide";
						};
					};

					if(pixel.role == "sand" && pixel.temp > elements.sand.tempHigh) {
						changePixel(pixel,"molten_glass",false);
						return;
					};
					
					if(pixel.role == "aggregate" && pixel.temp > magmaTempHigh) {
						changePixel(pixel,magmaName,false);
						return;
					};

					if(pixel.role == "alumina" && pixel.temp > elements.aluminum_oxide.tempHigh) {
						changePixel(pixel,"molten_aluminum_oxide",false);
						return;
					};

					if(pixel.role == "ferricOxide" && pixel.temp > elements.rust.tempHigh) {
						changePixel(pixel,"molten_iron",false);
						return;
					};

					if(pixel.role == "sulfurTrioxide" && pixel.temp > magmaTempHigh) { //arbitrary choice: leave when the aggregate leaves
						changePixel(pixel,"sulfur_trioxide_gas",false);
						return;
					};

					if(pixel.role == "lime" && pixel.temp > 550) {
						changePixel(pixel,"slaked_lime",false);
						return;
					};

					if(pixel.role == "silica") {
						pixel.didQuartzThermalExpansion ??= false;

						if(pixel.temp > 573 && !pixel.didQuartzThermalExpansion) {
							if(Math.random() < 0.13) {
								changePixel(pixel,"pop",false);
							};
							pixel.didQuartzThermalExpansion = true;
						};
						 
						if(pixel.temp > elements.silica.tempHigh) {
							changePixel(pixel,"molten_silica",false);
							return;
						};
					};
				};

				newConcreteTick = elements.concrete.tick;

				if(elements.hanging_concrete) {
					elements.hanging_concrete.tick = function(pixel) {
						newConcreteTick(pixel);
					};
				};

				if(elements.attach_concrete) {
					oldAttachConcreteTick = elements.attach_concrete.tick ;
					elements.attach_concrete.tick = function(pixel) {
						oldAttachConcreteTick(pixel);
						newConcreteTick(pixel);
					};
				};

				if(elements.crumbling_concrete) {
					oldCrumblingConcreteTick = elements.crumbling_concrete.tick ;
					newConcreteTick = elements.concrete.tick ;
					elements.crumbling_concrete.tick = function(pixel) {
						oldCrumblingConcreteTick(pixel);
						newConcreteTick(pixel);
					};
				};

/*	//Rocks
	
		//Igneous

			//Phaneritic

				//Ultramafic: peridotite

					var molten_olivine = ["molten_fayalite","molten_forsterite","molten_forsterite"];

					//apparently olivine sand exists
					elements.olivine_sand = {
						color: ['#b5a773', '#b5af78', '#b2b471', '#bab07b', '#b4ae74', '#b4b471', '#b5a970', '#b4b476'],
						behavior: behaviors.POWDER,
						tempHigh: 1750, //https://www.indiamart.com/olivineindia/olivine-sand.html
						stateHigh: molten_olivine,
						category: "land",
						state: "solid",
						density: 1720,
					};

					elements.wet_olivine_sand = {
						color: ["#a08d4b","#918949","999c49","#aa9b50","#8f8743","#adad53","#9d8f48","#838f43"],
						behavior: behaviors.STURDYPOWDER,
						reactions: {
							"sand": { "elem1":"sand", "elem2":"wet_olivine_sand", "chance":0.0005, "oneway":true },
							"olivine_sand": { "elem1":"olivine_sand", "elem2":"wet_olivine_sand", "chance":0.0005, "oneway":true },
							"dirt": { "elem1":"olivine_sand", "elem2":"mud", "chance":0.0005, "oneway":true },
						},
						tempHigh: 100,
						stateHigh: "packed_olivine_sand",
						tempLow: -50,
						stateLow: "packed_olivine_sand",
						category: "land",
						state: "solid",
						density: 2002,
					};

					elements.packed_olivine_sand = {
						color: ["#968f64","#969669","#8d9362","#9d996c","#959465","#8f9362","#949061","#909366"],
						behavior: behaviors.SUPPORT,
						tempHigh: 1700,
						stateHigh: molten_olivine,
						category: "land",
						state: "solid",
						density: 1811,
						breakInto: "olivine_sand",
					};
					
					elements.water.reactions.olivine_sand = { "elem1": null, "elem2": "wet_olivine_sand" };

					newPowder("fayalite",["#bf7432","#ad8e3e"],4390,1200,null,null);

					newPowder("forsterite","#cccccc",3270,1890,null,null);

					elements.molten_forsterite = {
						reactions: {
							"molten_fayalite": { elem1: "olivine", elem2: ["molten_fayalite","olivine"], tempMax: 1890 },
						},
					};

					elements.olivine = {
						color: ["#7fa14f","#7dba52"],
						behavior: behaviors.POWDER,
						tempHigh: 1890,
						stateHigh: molten_olivine,
						category: "solids",
						state: "solid",
						density: 2700,
						breakInto: "olivine_shard",
					},

					newPowder("olivine_shard",["#97ba65","#7a994e","#99d96c","#7cb553"],2811,1890,molten_olivine,null);						
*/
	//Gems
	  //There is a mineral classification scheme, but it will take a while to implement if I ever get around to it.
	  //We're assuming that the crystal structures reform properly because I don't want to have to research and implement refrozen amorphous forms.

		//Emerald
		
			elements.emerald = {
				color: ["#31e31e", "#88fa5a", "#28d419", "#54e823", "#64f235"],
				tempHigh: 1287,
					//1: I can't be arsed to find out what happens to emerald in extreme heat. Apparently, neither can anyone else, and Google is useless for this.
					//2: So I'm just assuming that the chromium impurities are polite and remain in suspension with the molten beryl.
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 2710, //within natural variation
				hardness: 0.8, //Mohs scaled to diamond
			};

		//Amethyst

			elements.amethyst = {
				color: ["#c569e0", "#bd43e0", "#e37aeb", "#ab2fe0", "#b05bd4", "#9b2cdb"],
				tempHigh: 1650,
				//1: Gee, another quartz-like...
				//2: Like with emerald, I'm trusting the impurities to stay dissolved because I don't exactly have any amethyst laying around to melt.
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 2650,
				hardness: 0.7,
			};

		//Sapphire

			elements.sapphire = {
				color: ["#2d43e3", "#4d5fe3", "#1f30cc", "#375fdb", "#2d39e3"],
				tempHigh: 2040,
					//1: You can actually grow corundum-based gems through the Verneuil process
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 3980,
				hardness: 0.9,
			}

		//Ruby

			elements.ruby = {
				//Corundum with different impurities, so I can copy/paste everything but the color
				color: ["#ff1222", "#ff4545", "#e30b13", "#fa253b", "#f2120f"],
				tempHigh: 2040,
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 3980,
				hardness: 0.9,
			}

		//Topaz

			elements.topaz = {
				color: ["#f7f431", "#ffff5c", "#f7e048", "#fae43e", "#fff86e", "#ede321"],
				tempHigh: 1340,
				stateHigh: "mullite", //thermal decomposition
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 3500,
				hardness: 0.8,
			};
			
		//Mullite

			elements.mullite = {
				color: ["#f2d7bf", "#f5cbdc", "#f2dfd3"], //hardly a gemstone, but i will color it like the others regardless
				tempHigh: 1840,
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 3110,
				hardness: 0.7,
			};

		//Onyx

			elements.onyx = {
				color: ["#1a1919", "#070605", "#111313"],
				tempHigh: 1650, //another  silicate  mineral
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 2650,
				hardness: 0.7,
			};

		//Opal

			elements.opal = {
				color: ["#ffcfcf", "#fff0d9", "#fcf7c5", "#e4ffd4", "#d1fff5", "#dcecfa", "#dfdbff", "#f5e0ff", "#f7d0f1"],
				tempHigh: 100,
				stateHigh: ["broken_opal", "broken_opal", "broken_opal", "broken_opal", "broken_opal", "broken_opal", "broken_opal", "broken_opal", "broken_opal", "steam"],
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 2090,
				hardness: 0.6,
				breakInto: ["quartz", "quartz", "quartz", "quartz", "quartz", "quartz", "quartz", "quartz", "quartz", "water"],
			};

			elements.broken_opal = {
				color: ["#f5e6e6", "#ebe2d5", "#f7f6ed", "#e4eddf", "#d8ebe7", "#d8e0e8", "#e4e3e8", "#f4edf7", "#ebebeb"],
				tempHigh: 1650,
				stateHigh: "molten_quartz",
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 2322,
				hardness: 0.55, //it cracks
			};

		//Quartz

			elements.quartz = { //silicates, silicates, and more silicates
				color: ["#f0f0f0", "#e3e3e3", "#f7f7f7"],
				tempHigh: 1650, 
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 2650,
				hardness: 0.7,
			};
			
			newPowder("silica","#faf9f0",2196,1713).hardness = 0.7;
			
			elements.molten_silica = {
				tempHigh: 2950,
			};

			//Re-add molten quartz because it stopped auto-generating
			
			elements.molten_quartz = {"behavior":behaviors.MOLTEN,"hidden":true,"state":"liquid","category":"states","color":['#ffff78', '#fff078', '#ffb400', '#ffff71', '#ffe371', '#ffaa00', '#ffff7b', '#fff77b', '#ffb900'],"temp":1650,"tempLow":1550,"stateLow":"quartz","density":2385,"viscosity":10000,"reactions":{"ash":{"elem1":null,"elem2":"molten_slag"},"dust":{"elem1":null,"elem2":"molten_slag"},"magma":{"elem1":null,"elem2":"molten_slag"}},"movable":true}

			//Use in glass

			elements.molten_quartz.reactions = {
				quicklime: { elem1: "molten_glass", elem2: ["quicklime", "quicklime", "quicklime", "quicklime", "quicklime", "quicklime", "quicklime", "quicklime", "quicklime", null]} //lack of vanilla washing soda, lack of tripartite reactions
			};
			/*
			elements.elem1.reactions = {
				elem2: { elem1: "elem1_becomes", elem2: "elem2_becomes"}
			};
			*/
		
		//Pearl (not a mineral)

			elements.pearl = {
				color: ["#e3e3e3", "#e3e0d1", "#eddbce", "#eef2c9", "#d5f5dc", "#d8f2ec", "#fadcf9", "#e3d1c1", "#f2edc9", "#e0f5d7", "#e2beeb", "#e3e3e3", "#e3e0d1", "#eddbce", "#eef2c9", "#d5f5dc", "#d8f2ec", "#fadcf9", "#e3d1c1", "#f2edc9", "#e0f5d7", "#e2beeb", 	"#38332e"],
				tempHigh: 1340, //yay, more thermal decomposition elements
				behavior: behaviors.POWDER,
				category: "powders",
				state: "solid",
				density: 772, //It is partly made of proteins and is said to burn, but I can't find an ignition point, so here it melts.
				hardness: 0.45,
			};

	//Soil

		//Dry dirt

			elements.dry_dirt = {
				color: ["#a88e5e","#8f7950","#8a7045","#9e804c"],
				behavior: [
					"XX|SW:dirt%3 AND SW:mud%6|XX",
					"XX|XX|XX",
					"M2|M1|M2",
				],
				tempHigh:1200,
				stateHigh: "molten_dirt",
				tempLow: -50,
				stateLow: "dry_permafrost",
				category:"land",
				state: "solid",
				density: 1100,
			},

			elements.molten_dirt = { //added manually because the change to dirt will prevent molten_dirt from being auto-generated
				"behavior": behaviors.MOLTEN,
				"hidden": true,
				"state": "liquid",
				"category": "states",
				"color": ["#EC6A15", "#EC5515", "#EC3F00", "#B85210", "#B84210", "#B83100", "#AE4B0D", "#AE3C0D", "#AE2D00", "#D65A0F", "#D6480F", "#D63600"],
				"temp": 1200,
				"tempLow": 1100,
				"stateLow": "dry_dirt",
				"density": 1098,
				"viscosity": 10000
			}

			if(enabledMods.includes("mods/boiling_rock.js")) {
				elements.molten_dirt.tempHigh = 3000;
				elements.molten_dirt.stateHigh = "vaporized_rock";
			};

			elements.dry_permafrost = {
				color: ["#5B7870","#535D51","#52746A","#5A7A6F"],
				behavior: behaviors.POWDER, //not enough water for cementing
				temp: -50,
				tempHigh: 10,
				stateHigh: "dry_dirt",
				category: "land",
				state: "solid",
				state: "solid",
				density: 1200,
			}

			elements.dirt.tempHigh = 110;
			elements.dirt.stateHigh = "dry_dirt";

			elements.water.reactions.dry_dirt = { elem1: null, elem2: "dirt", chance: 0.1 }
			elements.water.reactions.radioactive_dry_dirt = { elem1: null, elem2: "radioactive_dirt", chance: 0.1 }

			if(!elements.mud.reactions) {
				elements.mud.reactions = {};
			};
			elements.mud.reactions.dry_dirt = { elem1: "dirt", elem2: "dirt", chance: 0.06 }
			elements.mud.reactions.radioactive_dry_dirt = { elem1: "radioactive_dirt", elem2: "radioactive_dirt", chance: 0.06 }

	//Land Element Cults
		/*
		"Cult" is used similarly to its EoD sense; here, it signifies a set of elements that systematically replicates another set of elements except for a given modification.
		In this case, they replicate some land elements; a "yellow" cult, for example, would have yellow_dirt, yellow_mud, yellow_mudstone, yellow_permafrost, yellow_sand...
		*/

		//Radioactive land

			//Radioactive behavior cult (see above)

				behaviors.RAD_POWDER = [
					"XX|CR:radiation%2|XX",
					"CR:radiation%2|HT%1.5|CR:radiation%2",
					"M2|M1 AND CR:radiation%2|M2",
				],
				behaviors.RAD_STURDYPOWDER = [
					"XX|CR:radiation%2|XX",
					"CR:radiation%2|HT%1.5|CR:radiation%2",
					"XX|M1 AND CR:radiation%2|XX",
				],
				behaviors.RAD_SUPPORT = [
					"CR:radiation%1|CR:radiation%2|CR:radiation%1",
					"SP AND CR:radiation%2|HT%1.5|SP AND CR:radiation%2",
					"XX|M1 AND CR:radiation%2|XX",
				],
				behaviors.RAD_SUPPORTPOWDER = [
					"CR:radiation%1|CR:radiation%2|CR:radiation%1",
					"SP AND CR:radiation%2|HT%1.5|SP AND CR:radiation%2",
					"M2|M1 AND CR:radiation%2|M2",
				],
				behaviors.RAD_LIQUID = [
					"XX|CR:radiation%2|XX",
					"M2 AND CR:radiation%2|HT%1.5|M2 AND CR:radiation%2",
					"M1|M1 AND CR:radiation%2|M1",
				],
				behaviors.RAD_WALL = [
					"CR:radiation%0.7|CR:radiation%1.4|CR:radiation%0.7",
					"CR:radiation%1.4|HT%1.50000000000|CR:radiation%1.4",
					"CR:radiation%0.7|CR:radiation%1.4|CR:radiation%0.7",
				],
				behaviors.RAD_GAS = [
					"M2 AND CR:radiation%1.0|M1 AND CR:radiation%2|M2 AND CR:radiation%1",
					"M1 AND CR:radiation%2|HT%1 AND CR:radiation%2|M1 AND CR:radiation%2",
					"M2 AND CR:radiation%1.0|M1 AND CR:radiation%2|M2 AND CR:radiation%1",
				],
				behaviors.RAD_MOLTEN = [
					"XX|CR:radiation%2.5 AND CR:fire%2.5|XX",
					"M2 AND CR:radiation%1|HT%2|M2 AND CR:radiation%1",
					"M1|M1 AND CR:radiation%1|M1",
				]

				//console.log(behaviors.RAD_POWDER) //forcing it to acknowledge the behaviors i just added instead of giving me "undefined"
				
			//Setting reactions (we'll define the elements later)
			
				var namelessArray = ["dirt","sand","mud","wet_sand"];
				for(i = 0; i < namelessArray.length; i++) {
					var elementt = namelessArray[i];
					if(!elements[elementt].reactions) {
						elements[elementt].reactions = {};
					};
				};
			
				elements.water.reactions.radiation = { elem1: "radioactive_water", elem2: null, chance:0.25 },
				elements.radiation.reactions.water = { elem2: "radioactive_water", elem1: null, chance:0.25 },
				elements.dirt.reactions.radiation = { elem1: "radioactive_dirt", elem2: null, chance:0.25 },
				elements.radiation.reactions.dirt = { elem2: "radioactive_dirt", elem1: null, chance:0.25 },
				elements.sand.reactions.radiation = { elem1: "radioactive_sand", elem2: null, chance:0.25 },
				elements.radiation.reactions.sand = { elem2: "radioactive_sand", elem1: null, chance:0.25 },
				elements.mud.reactions.radiation = { elem1: "radioactive_mud", elem2: null, chance:0.25 },
				elements.radiation.reactions.mud = { elem2: "radioactive_mud", elem1: null, chance:0.25 },
				elements.wet_sand.reactions.radiation = { elem1: "radioactive_wet_sand", elem2: null, chance:0.25 },
				elements.radiation.reactions.wet_sand = { elem2: "radioactive_wet_sand", elem1: null, chance:0.25 },

			//Substitution table

				radioactiveObject = {
					dirt:				"radioactive_dirt",
					dry_dirt:			"radioactive_dry_dirt",
					molten_dirt:		"molten_radioactive_dirt",
					glass:				"radioactive_glass",
					molten_glass:		"molten_radioactive_glass",
					glass_shard:		"radioactive_glass_shard",
					sand:				"radioactive_sand",
					mud:				"radioactive_mud",
					wet_sand:			"radioactive_wet_sand",
					water:				"radioactive_water",
					permafrost:			"radioactive_permafrost",
					dry_permafrost:		"radioactive_dry_permafrost",
					mudstone:			"radioactive_mudstone",
					packed_sand:		"radioactive_packed_sand",
					ice:				"radioactive_ice",
					snow:				"radioactive_snow",
					packed_snow:		"radioactive_packed_snow",
					rain_cloud:			"rad_cloud",
					snow_cloud:			"rad_snow_cloud",
					snow_cloud_floater:	"rad_snow_cloud_floater",
					rock:				"radioactive_rock",
					gravel:				"radioactive_gravel",
					basalt:				"radioactive_basalt",
					magma:				"radioactive_magma",
					sandstone:			"radioactive_sandstone",
					sand_sediment: 		"radioactive_sand_sediment"
				};
				
				if(enabledMods.includes("mods/glenn_gases.js")) {
					radioactiveObject.rock_dust = "radioactive_rock_dust";
				};
			
				if(enabledMods.includes("mods/fire_mod.js")) {
					radioactiveObject.fire = "rad_fire";
					radioactiveObject.torch = "rad_torch";
				};
			
				if(enabledMods.includes("mods/structure_test.js")) {
					radioactiveObject.glass = "rad_glass";
					radioactiveObject.glass_pane = "rad_glass_pane";
					radioactiveObject.glass_shard = "rad_glass_shard";
				};
			
			//Reverse lookup function

				function getKeyByValue(object, value) {
				  return Object.keys(object).find(key => object[key] === value);
				}
				//getKeyByValue code by UncleLaz on StackOverflow: https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value"

			//Main elements

				elements.radioactive_dirt = {
					color: ["#70762b","#4c5c21","#50571a","#4c6b1e"],
					behavior: behaviors.RAD_POWDER,
					tempHigh:110,
					stateHigh: "radioactive_dry_dirt",
					reactions: {
						"dirt": { "elem1":"dirt", "elem2":"radioactive_dirt", "chance":0.0005, "oneway":true },
						"dry_dirt": { "elem1":"radioactive_dry_dirt", "elem2":"radioactive_dirt", "chance":0.0005, "oneway":true },
						"radioactive_dry_dirt": { "elem1":"radioactive_dry_dirt", "elem2":"radioactive_dirt", "chance":0.0005, "oneway":true },
					},
					tempLow: -50,
					stateLow: "radioactive_permafrost",
					category: "Radioactive",
					state: "solid",
					density: 1220,
				};

				elements.radioactive_dry_dirt = {
					color: ["#8aa85e","#999c5d","#7f8a45","#b5ad59"],
					behavior: [
						"XX|SW:radioactive_dirt%3 AND SW:radioactive_mud%6 AND CR:radiation%2|XX",
						"AND CR:radiation%2|HT%1.5|CR:radiation%2",
						"M2|M1 AND CR:radiation%2|M2",
					],
					tempHigh:1200,
					stateHigh: "molten_radioactive_dirt",
					tempLow: -50,
					stateLow: "radioactive_dry_permafrost",
					category:"land",
					state: "solid",
					density: 1100,
				},

				elements.molten_radioactive_dirt = {
					"behavior": behaviors.RAD_MOLTEN,
					"hidden": true,
					"state": "liquid",
					"category": "Radioactive",
					"color": ["#e09315", "#e07615", "#e05800", "#987310", "#985c10", "#984500", "#a06c0d", "#a0570d", "#a04100", "#98850f", "#986b0f", "#985000"],
					"temp": 1250,
					"tempLow": 1100,
					"stateLow": "radioactive_dirt",
					"density": 1098,
					"viscosity": 10000
				}

				elements.radioactive_glass = {
					color: ["#597a58","#719171"],
					colorOn: ["#6dab67","#88b567"],
					behavior: behaviors.RAD_WALL,
					tempHigh: 1500,
					category: "solids",
					state: "solid",
					density: 2500,
					breakInto: "radioactive_glass_shard",
					conduct: 0.01,
				};

				elements.molten_radioactive_glass = {
					behavior: behaviors.RAD_MOLTEN,
					category: "Radioactive",
				};

				elements.radioactive_glass_shard = {
					color: ["#597a58","#719171", "#628263"],
					colorOn: ["#6dab67","#88b567", "#7bad6f"],
					behavior: behaviors.RAD_POWDER,
					tempHigh: 1500,
					stateHigh: "molten_radioactive_glass",
					category: "powders",
					state: "solid",
					density: 2500,
					conduct: 0.01,
				};

				elements.radioactive_sand = {
					color: "#cbdb7b",
					behavior: behaviors.RAD_POWDER,
					tempHigh: 1700,
					stateHigh: "molten_radioactive_glass",
					category: "Radioactive",
					state: "solid",
					density: 1602
				};

				elements.radioactive_mud = {
					color: "#3c401c",
					behavior: behaviors.RAD_STURDYPOWDER,
					reactions: {
						"dry_dirt": { "elem1": "radioactive_dirt", "elem2": "radioactive_dirt", chance: 0.06 },
						"radioactive_dirt": { "elem1":"radioactive_dirt", "elem2":"radioactive_mud", "chance":0.0005, "oneway":true },
						"radioactive_sand": { "elem1":"radioactive_dirt", "elem2":"radioactive_wet_sand", "chance":0.0005, "oneway":true },
						"sand": { "elem1":"radioactive_dirt", "elem2":"radioactive_wet_sand", "chance":0.0005, "oneway":true },
						"dirt": { "elem1":"radioactive_dirt", "elem2":"radioactive_mud", "chance":0.0005, "oneway":true },
					},
					tempHigh: 100,
					stateHigh: "radioactive_mudstone",
					tempLow: -50,
					stateLow: "radioactive_permafrost",
					category: "Radioactive",
					state: "solid",
					density: 1730,
					stain: 0.02,
				};

				elements.radioactive_wet_sand = {
					color: ["#848c3a","#969e4c"],
					behavior: behaviors.RAD_STURDYPOWDER,
					reactions: {
						"radioactive_sand": { "elem1":"radioactive_sand", "elem2":"radioactive_wet_sand", "chance":0.0005, "oneway":true },
						"radioactive_dirt": { "elem1":"radioactive_sand", "elem2":"radioactive_mud", "chance":0.0005, "oneway":true },
						"sand": { "elem1":"radioactive_sand", "elem2":"radioactive_wet_sand", "chance":0.0005, "oneway":true },
						"dirt": { "elem1":"radioactive_sand", "elem2":"radioactive_mud", "chance":0.0005, "oneway":true },
						"wet_sand": { "elem1":"radioactive_sand", "elem2":"radioactive_sand_sediment", "chance":0.0005, "oneway":true },
						"sand_sediment": { "elem1":"radioactive_sand", "elem2":"radioactive_sand_sediment", "chance":0.0005, "oneway":true },
						"radioactive_wet_sand": { "elem1":"radioactive_sand", "elem2":"radioactive_sand_sediment", "chance":0.0005, "oneway":true },
						"radioactive_sand_sediment": { "elem1":"radioactive_sand", "elem2":"radioactive_sand_sediment", "chance":0.0005, "oneway":true },
					},
					tempHigh: 100,
					stateHigh: "radioactive_packed_sand",
					category: "Radioactive",
					state: "solid",
					density: 1905,
				};

				elements.radioactive_sandy_water = {
					color: ["#84A244", "#90AE50"],
					behavior: behaviors.RAD_LIQUID,
					tempHigh: 100,
					stateHigh: ["rad_steam","rad_steam","radioactive_sand"],
					//tempLow: 0,
					//stateLow: "radioactive_sandy_ice",
					category: "Radioactive",
					heatCapacity: 4.184, //unimplemented
					reactions: {
						"dirt": { // React with (water reacts with dirt to make mud)
							"elem1": [null,null,"radioactive_wet_sand"], // First element transforms into; in this case, water deletes itself
							"elem2": "radioactive_mud", // Second element transforms into; in this case, dirt turns to mud
						},
						"radioactive_dirt": { // React with (water reacts with dirt to make mud)
							"elem1": [null,null,"radioactive_wet_sand"], // First element transforms into; in this case, water deletes itself
							"elem2": "radioactive_mud", // Second element transforms into; in this case, dirt turns to mud
						},
						"water": { "elem1":"radioactive_water", "elem2":"radioactive_sandy_water", "chance":0.025 },
						"radioactive_water": { "elem1":"radioactive_water", "elem2":"radioactive_sandy_water", "chance":0.025 },
						"sand": { "elem1": [null,null,"radioactive_wet_sand"], "elem2": "radioactive_wet_sand", },
						"radioactive_sand": { "elem1": [null,null,"radioactive_wet_sand"], "elem2": "radioactive_wet_sand", },
						"sandy_water": { "elem1":"radioactive_wet_sand", "elem2":"radioactive_sand_sediment", "chance": 0.001 },
						"radioactive_sandy_water": { "elem1":"radioactive_wet_sand", "elem2":"radioactive_sand_sediment", "chance": 0.001 },
						"wet_sand": { "elem1": "radioactive_water", "elem2":"radioactive_sand_sediment", "chance": 0.0005 },
						"radioactive_wet_sand": { "elem1": "radioactive_water", "elem2":"radioactive_sand_sediment", "chance": 0.0005 },
						/*"salt": { "elem1": "salt_water", "elem2": null },
						"sugar": { "elem1": "sugar_water", "elem2": null, },
						"dust": { "elem1": "dirty_water", "elem2": null, },
						"ash": { "elem1": "dirty_water", "elem2": null, },
						"cyanide": { "elem1": "dirty_water", "elem2": null, },
						"carbon_dioxide": { "elem1": "seltzer", "elem2": null, "oneway":true },
						"sulfur": { "elem1": "dirty_water", "elem2": null, },
						"rat": { "elem1": "dirty_water", chance:0.005 },
						"plague": { "elem1": "dirty_water", "elem2": null, },
						"rust": { "elem1": "dirty_water", chance:0.005 },
						"fallout": { "elem1": "dirty_water", chance:0.25 },
						"radiation": { "elem1": "dirty_water", chance:0.25 },
						"uranium": { "elem1": "dirty_water", chance:0.25 },
						"rotten_meat": { "elem1": "dirty_water", chance:0.25 },
						"quicklime": { "elem1": [null,null,"wet_sand"], "elem2": "slaked_lime", },
						"rock": { "elem2": "wet_sand", "chance": 0.00035 },
						"ruins": { "elem2": "rock", "chance": 0.00035 },*/
						"mudstone": { "elem2": "radioactive_mud", "chance": 0.00035 },
						"radioactive_mudstone": { "elem2": "radioactive_mud", "chance": 0.00035 },
						//"methane": { "elem1":"primordial_soup", "elem2":"primordial_soup", tempMin:60, charged:true },
						//"ammonia": { "elem1":"primordial_soup", "elem2":"primordial_soup", tempMin:60, charged:true },
						"fly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"firefly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"bee": { "elem2":"dead_bug", "chance":0.05, "oneway":true },
						"stink_bug": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
					},
					state: "liquid",
					density: 1097,
					conduct: 0.02,
					stain: 0.01,
				}

				elements.radioactive_sand_sediment = {
					hidden: true,
					color: "#afd182",
					hardness: 0.2,
					behavior: [
						"XX|XX|XX",
						"XX|XX|XX",
						"SW:wet_sand,radioactive_wet_sand%1.5 AND M2|SW:wet_sand,radioactive_wet_sand%2.5 AND M1|SW:wet_sand,radioactive_wet_sand%1.5 AND M2"
					],
					reactions: {
						"water": { "elem1":"radioactive_sandy_water", "elem2":"radioactive_sandy_water", "chance":0.025 },
						"radioactive_water": { "elem1":"radioactive_sandy_water", "elem2":"radioactive_sandy_water", "chance":0.025 },
						"sand": { "elem1": [null,null,"radioactive_wet_sand"], "elem2": "radioactive_wet_sand", },
						"radioactive_sand": { "elem1": [null,null,"radioactive_wet_sand"], "elem2": "radioactive_wet_sand", },
						"sandy_water": { "elem1":["radioactive_water","radioactive_water","radioactive_sand_sediment"], "chance":0.001 },
						"radioactive_sandy_water": { "elem1":["radioactive_water","radioactive_water","radioactive_sand_sediment"], "chance":0.001 },
						"wet_sand": { "elem2": "radioactive_sand_sediment", "chance": 0.0005 },
						"radioactive_wet_sand": { "elem2": "radioactive_sand_sediment", "chance": 0.0005 },
					},
					tempHigh: 1700,
					stateHigh: "molten_radioactive_glass",
					category: "Radioactive",
					state: "solid",
					density: 1602,
					breakInto: "radioactive_sand",
					tick: function(pixel) {
						sedimentation(pixel,"radioactive_sandstone")
					},
				}

				elements.radioactive_sandstone = {
					color: ["#85b357", "#b5d177", "#9cd184", "#7bc25f"],
					behavior: behaviors.RAD_WALL,
					tempHigh: 1500,
					stateHigh: "molten_radioactive_glass",
					category: "Radioactive",
					state: "solid",
					density: 2323, //wide range
					hardness: 0.5,
					breakInto: "radioactive_sand",
				}

				elements.radioactive_water = {
					color: "#85cf57",
					behavior: behaviors.RAD_LIQUID,
					tempHigh: 100,
					stateHigh: ["rad_steam","rad_steam","fallout"],
					tempLow: -5,
					stateLow: "radioactive_ice",
					category: "Radioactive",
					heatCapacity: 4.184,
					reactions: {
						"water": { elem1: "water", elem2: "radioactive_water", chance:0.05 }, //swap
						"dirt": { // React with (water reacts with dirt to make mud)
							"elem1": null, // First element transforms into; in this case, water deletes itself
							"elem2": "radioactive_dirt", // Second element transforms into; in this case, dirt turns to mud
						},
						"dry_dirt": { "elem1": null, "elem2": "radioactive_dirt", },
						"radioactive_dirt": { "elem1": null, "elem2": "radioactive_dirt", },
						"sand": { "elem1": null, "elem2": "radioactive_wet_sand", },
						"wet_sand": { "elem1": "radioactive_sandy_water", "elem2": ["radioactive_wet_sand","radioactive_wet_sand","radioactive_wet_sand","radioactive_wet_sand","radioactive_wet_sand",null], chance: 0.01 },
						"radioactive_wet_sand": { "elem1": "radioactive_sandy_water", "elem2": ["radioactive_wet_sand","radioactive_wet_sand","radioactive_wet_sand","radioactive_wet_sand","radioactive_wet_sand",null], chance: 0.01 },
						"rat": { "elem2": "rotten_meat", chance:0.005 },
						"plague": { "elem2": null, chance: 0.3, },
						//"quicklime": { "elem1": null, "elem2": "slaked_lime", },
						"rock": { "elem2": "radioactive_wet_sand", "chance": 0.00035 },
						//"ruins": { "elem2": "rock", "chance": 0.00035 },
						"mudstone": { "elem2": "radioactive_mud", "chance": 0.00035 },
						"radioactive_mudstone": { "elem2": "radioactive_mud", "chance": 0.00035 },
						"packed_sand": { "elem2": "radioactive_wet_sand", "chance": 0.00035 },
						"radioactive_packed_sand": { "elem2": "radioactive_wet_sand", "chance": 0.00035 },
						"fly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"firefly": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
						"bee": { "elem2":"dead_bug", "chance":0.05, "oneway":true },
						"stink_bug": { "elem2":"dead_bug", "chance":0.1, "oneway":true },
					},
					state: "liquid",
					density: 997,
					conduct: 0.03,
					stain: 0.02,
				}

				elements.rad_steam.behavior = behaviors.RAD_GAS;
				elements.rad_steam.stateLow = "radioactive_water";
				elements.rad_cloud.behavior =  [
					"XX|XX|XX",
					"XX|CH:fallout,radiation,radioactive_water%0.025|M1%2.5 AND BO",
					"CR:radiation%0.05|CR:radiation%0.05|CR:radiation%0.05",
				];
				elements.rad_cloud.tempLow = 0;
				elements.rad_cloud.stateLow = "rad_snow_cloud";
				elements.fallout.behavior = behaviors.RAD_POWDER;

				elements.radioactive_permafrost = {
					color: ["#51613d","#495234","#3b4a30","#4a4f35"],
					behavior: behaviors.RAD_SUPPORT,
					temp: -50,
					tempHigh: 10,
					stateHigh: "radioactive_mudstone",
					category: "Radioactive",
					state: "solid",
					density: 700,
				};

				elements.radioactive_dry_permafrost = {
					color: ["#6e9970","#64756a","#4e7864", "#5f8a78"],
					behavior: behaviors.POWDER, //not enough water for cementing
					temp: -50,
					tempHigh: 10,
					stateHigh: "radioactive_dry_dirt",
					category: "land",
					state: "solid",
					state: "solid",
					density: 1200,
				}

				elements.radioactive_mudstone = {
					color: "#4f5e25",
					behavior: behaviors.RAD_SUPPORT,
					tempHigh:1200,
					stateHigh: "molten_radioactive_dirt",
					tempLow: -50,
					stateLow: "radioactive_permafrost",
					category: "Radioactive",
					state: "solid",
					density: 1250,
					breakInto: "radioactive_dirt",
				};

				elements.radioactive_packed_sand = {
					color: "#79945c",
					behavior: behaviors.RAD_SUPPORT,
					tempHigh: 1700,
					stateHigh: "molten_radioactive_glass",
					category: "Radioactive",
					state: "solid",
					density: 1682,
					breakInto: "radioactive_sand",
				};

				elements.radioactive_ice = {
					color: "#b7e0b4",
					behavior: behaviors.RAD_WALL,
					temp: 0,
					tempHigh: 5,
					stateHigh: "radioactive_water",
					category: "solids",
					state: "solid",
					density: 917,
					breakInto: "radioactive_snow",
				};

				elements.radioactive_snow = {
					color: "#d5f2d3",
					behavior: behaviors.RAD_POWDER,
					temp: 0,
					tempHigh: 5,
					tempLow: -100,
					stateLow: "radioactive_packed_snow",
					stateHigh: "radioactive_water",
					category: "Radioactive",
					state: "solid",
					density: 100,
				};

				elements.radioactive_packed_snow = {
					color: "#a7d4a3",
					behavior: behaviors.RAD_SUPPORTPOWDER,
					temp: 0,
					tempHigh: 20,
					tempLow: -200,
					stateLow: "radioactive_ice",
					stateHigh: "radioactive_water",
					category: "Radioactive",
					state: "solid",
					density: 400,
					hidden: true,
				};

				elements.rad_snow_cloud = {
					color: ["#2d6e31","#416e21"],
					behavior: [
						"XX|XX|XX",
						"XX|CH:fallout,radiation,radioactive_snow%0.025|M1%2.5 AND BO",
						"CR:radiation%0.05|CR:radiation%0.05|CR:radiation%0.05",
					],
					category:"Radioactive",
					hidden: true,
					state: "gas",
					density: 0.5,
					ignoreAir: true,
					temp: -20,
					tempHigh: 0,
					stateHigh: "rad_cloud",
				};

				elements.rad_snow_cloud_floater = {
					color: ["#2d6e31","#416e21"],
					behavior: [
						"M2|M1|M2",
						"M1%80|CH:rad_snow_cloud_%0.2|M1%80",
						"M%60|XX|M2%60",
					],
					reactions: {
						"rad_snow_cloud_floater": { elem1: "rad_snow_cloud", elem2: "rad_snow_cloud", chance: 0.003 },
						"rad_snow_cloud": { elem1: "rad_snow_cloud", elem2: "rad_snow_cloud", chance: 0.01 }
					},
					category:"Radioactive",
					hidden: true,
					state: "gas",
					density: 0.5,
					temp: -20,
					tempHigh: 0,
					stateHigh: "rad_cloud",
				};

				elements.radioactive_rock = {
					color: ["#768063","#444f3f","#7a9476"],
					behavior: behaviors.RAD_POWDER,
					tempHigh: 950,
					stateHigh: "radioactive_magma",
					category: "Radioactive",
					state: "solid",
					density: 2550,
					hardness: 0.5,
					breakInto: ["radioactive_sand","radioactive_gravel"],
				};

				elements.radioactive_gravel = {
					color: ["#d1e3c8","#a6b090","#657360","#4d523f"],
					behavior: behaviors.RAD_POWDER,
					category: "Radioactive",
					tempHigh: 950,
					stateHigh: "radioactive_magma",
					state: "solid",
					density: 1680,
					hardness: 0.2,
					breakInto: "radioactive_sand",
				};

				elements.radioactive_basalt = {
					color: ["#262e20","#23331f","#3f4235"],
					behavior: behaviors.RAD_STURDYPOWDER,
					tempHigh: 1262.5,
					stateHigh: "radioactive_magma",
					category: "Radioactive",
					state: "solid",
					density: 3000,
					hardness: 0.65,
					breakInto: "radioactive_gravel",
				};

				elements.radioactive_magma = {
					color: ["#ff9100","#ffae00","#ff8400"],
					behavior: behaviors.RAD_MOLTEN,
					reactions: {
						"ice": { "elem1": "radioactive_basalt" },
						"radioactive_ice": { "elem1": "radioactive_basalt" },
						"magma": { "elem1":"magma", "elem2":"radioactive_magma", "chance":0.0005, "oneway":true },
					},
					temp: 1500,
					tempLow: 850,
					stateLow: ["radioactive_basalt","radioactive_basalt","radioactive_basalt","radioactive_rock"],
					viscosity: 5000,
					category: "Radioactive",
					state: "liquid",
					density: 2725,
				};

				//(Just for fun)

				elements.super_irradiator = {
					color: "#66ee33",
					tick: function(pixel) {
						var twentiethOfTemp = pixel.temp / 20;
						var roundOf20th = Math.round(twentiethOfTemp);
						var boundedR20 = Math.max(1,Math.min(roundOf20th,11));
						transformAround(pixel,boundedR20,radioactiveObject)
					},
					category:"machines",
					insulate: true,
					state: "solid",
				};

				elements.super_deirradiator = {
					color: "#dd33ee",
					tick: function(pixel) {
						var twentiethOfTemp = pixel.temp / 20;
						var roundOf20th = Math.round(twentiethOfTemp);
						var boundedR20 = Math.max(1,Math.min(roundOf20th,11));
						transformAround(pixel,boundedR20,radioactiveObject,reverse=true)
					},
					category:"machines",
					insulate: true,
					state: "solid",
				};

				elements.liquid_irradium = {
					color: "#5499FF",
					behavior: behaviors.RAD_LIQUID,
					tick: function(pixel) {
						for(i = 0; i < adjacentCoords.length; i++) {
							transformAdjacent(pixel,radioactiveObject)
						}
					},
					//Becomes rainbow sand by water or poison, as well as by protocite, or bio-ooze
					//Becomes sulfuric acid on contact with it
					//Becomes corrupt slime by elder fluid
					//Converts black tar and organic soup into itself
					//Turns either grav liquid into aether dust, as well as liquid crystal
					//Turns blood into bloodstone
					//Turns blue slime into black slime
					//Made by {mercury or bio-ooze} and protocite
					category:"liquids",
					state: "liquid",
					density: 18180,	//Cherry-picked from a Tumblr headcanon
									//https://omniblog-of-starbound.tumblr.com/post/188424072728/starbound-element-headcannon-modded-metals
					viscosity: 80.1,	//probably misinterpreting tickDelta, and w/o the game assets, I can't compare against water, so this is in relation to H2SO4 scaled to its density in cP and under the assumption that water visc = 1
				};
				
			//Inter-mod compatibility

				if(enabledMods.includes("mods/some_tf_liquids.js")) {
					elements.radioactive_basalt_gravel = {
						color: ["#394d37", "#3b452f", "#3f452a", "#2d3d2c"],
						behavior: behaviors.RAD_POWDER,
						tempHigh: 1262.5,
						stateHigh: "radioactive_magma",
						category: "Radioactive",
						state: "solid",
						density: 1975,
						hardness: 0.26,
					}
					elements.radioactive_basalt.breakInto = "radioactive_basalt_gravel";
				};

			//Worldgen preset for testing

				worldgentypes.radioactive_sandstone_test_ocean = {
					layers: [
						[0.9, "radioactive_wet_sand", 0.2],
						[0.9, "radioactive_sand", 0.2],
						[0.8, "radioactive_sandy_water", 0.7],
						[0.25, "radioactive_water"],
						[0.1, "radioactive_sand", 0.1],
						[0.1, "clay", 0.1],
						[0.1, "radioactive_gravel", 0.2],
						[0.1, "radioactive_wet_sand"],
						[0.03, "radioactive_gravel", 0.5],
						[0.03, "radioactive_rock"],
						[0, "radioactive_basalt"],
					]
				};

			/*/Water irradiation reactions (must be done last)

				waterIrradiationExclusionArray = ["radioactive_water", "radioactive_wet_sand"]
				
				filteredWaterIrradiationArray = Object.keys(elements).filter(function(e) {
					return elements[e].category === "Radioactive" && (!waterIrradiationExclusionArray.includes(e));
				});

				for(i = 0; i < filteredWaterIrradiationArray.length; i++) {
					elements.water.reactions[filteredWaterIrradiationArray[i]] = { "elem1":"radioactive_water", chance: 0.01 }
				};*/

//Generation

	//TNT world

		//Supplementary elements

			elements.oil_cloud = {
				color: "#8c4331",
				behavior: [
					"XX|XX|XX",
					"XX|CH:oil%0.05|M1%2.5 AND BO",
					"XX|XX|XX",
				],
				category:"gases",
				temp: 30,
				state: "gas",
				density: 0.5,
				burn: 60,
				burnTime: 15,
				burnInto: "explosion", //atomization moment
				ignoreAir: true,
				stain: 0.02,
			};

			elements.oil_cloud_floater = {
				color: "#8c4331",
				behavior: [
					"M2|M1|M2",
					"M1%80|CH:oil_cloud%0.2|M1%80",
					"M%60|XX|M2%60",
				],
				reactions: {
					"oil_cloud_floater": { elem1: "oil_cloud", elem2: "oil_cloud", chance: 0.003 },
					"oil_cloud": { elem1: "oil_cloud", elem2: "oil_cloud", chance: 0.01 }
				},
				category:"gases",
				temp: 30, //otherwise identical
				state: "gas",
				density: 0.5,
				burn: 60,
				burnTime: 15,
				burnInto: "explosion", //atomization moment
				stain: 0.02,
			};

		//Main preset

			worldgentypes.tnt_world = {
				name: "TNT World", //unimplemented
				layers: [
					[0.9, "oil_cloud_floater"],
					[0.65, "coal", 0.1],
					[0.65, "nitroglycerin"],
					[0.55, "nitroglycerin", 0.5],
					[0.2, "coal", 0.2],
					[0.2, "tnt"],
					[0.05, "coal", 0.3],
					[0.05, "c4"],
					[0.0, "coal", 0.4],
					[0.0, "lamp_oil"]
				]
			};

		//Inter-mod compatibility

			runAfterLoad(function() {
				if(enabledMods.includes("mods/glenn_gases.js")) {
					worldgentypes.tnt_world.layers.unshift([0.9, "red_gas", 0.50])
				};
			});

	//Ice world

		//Supplementary elements

			elements.snow_cloud_floater = {
				color: "#7e8691",
				behavior: [
					"M2|M1|M2",
					"M1%80|CH:snow_cloud%0.2|M1%80",
					"M%60|XX|M2%60",
				],
				reactions: {
					"snow_cloud_floater": { elem1: "snow_cloud", elem2: "snow_cloud", chance: 0.003 },
					"snow_cloud": { elem1: "snow_cloud", elem2: "snow_cloud", chance: 0.01 }
				},
				category:"gases",
				temp:-10,
				tempHigh:30,
				stateHigh:"rain_cloud",
				tempLow:-200,
				stateLow:"hail_cloud",
				state:"gas",
				density:0.55,
				conduct:0.01,
				movable:true,
				isGas:true
			};
			
		//Main preset

			worldgentypes.ice = {
				layers: [
					//[0.95, "snow_cloud_floater"], //le cutting room floor has arrived
					[0.9, "snow"],
					[0.65, "ice"],
					[0.6, "gravel"],
					[0.35, "permafrost"],
					[0, "rock"]
				],
				temperature: -20
			};

	//Nuclear wasteland

		//Elements defined above
			
		//Main preset

			worldgentypes.nuclear_wasteland = {
				layers: [
					[0.9, "smoke", 0.5],
					[0.9, "rad_snow_cloud_floater", 0.75],
					[0.82, "fallout", 0.4],
					[0.7, "liquid_irradium", 0.05],
					[0.7, "dead_plant", 0.12],
					[0.55, "radioactive_dirt"],
					[0.45, "radioactive_rock"],
					[0.25, "uranium", 0.4],
					[0.35, "radioactive_rock", 0.5],
					[0.3, "radioactive_gravel", 0.5],
					[0.2, "uranium", 0.2],
					[0.05, "rock"],
					[0, "basalt"],
				],
				temperature: -5 //nuclear winter
			};

	//Dark world

	worldgentypes.dark = {
		layers: [
			[0.8, "carbon_dioxide"],
			[0.65, "ink"],
			[0.5, "charcoal"],
			[0, "basalt"]
		]
	};

	//Money world
	
	worldgentypes.money = {
		layers: [
			[0.9, "emerald"],
			[0.6, "diamond"],
			[0.3, "gold_coin"],
			[0.1, "ruby", 1/3],
			[0.1, "amethyst", 1/2],
			[0.1, "sapphire"],
			[-0.1, "pearl", 0.4],
			[-0.1, "onyx"]
		]
	};
	
	//Star world
	//If GWSN can have a decidedly Earth-y name and a space concept, then I should be able to do the same
	
		//Supplementary elements

			elements.liquid_stellar_plasma = {
				color: "#ffffbd",
				colorOn: "#ffffbd",
				behavior: [
					"XX|M2%5 AND CR:plasma%1|XX",
					"M2|XX|M2",
					"M1|M1|M1",
				],
				behaviorOn: [
					"XX|M2%10 AND M1%0.5 AND CR:plasma%2.3|XX",
					"M2|XX|M2",
					"M1|M1|M1",
				],
				tick: function(pixel) {
					almostSun(pixel,0.6,stellarPlasmaSpreadWhitelist);
				},
				temp:5500,
				isGas: true,
				tempLow:2300,
				stateLow: "plasma",
				category: "liquids",
				state: "liquid",
				density: 1000, //density actually depends on depth in the star: https://astronomy.stackexchange.com/a/32734
				conduct: 0.5,
			};

			elements.stellar_plasma = {
				color: "#ffffbd",
				colorOn: "#ffffbd",
				behavior: [
					"M2|M1 AND CR:plasma%0.6|M2",
					"M1 AND CR:plasma%0.6|XX|M1 AND CR:plasma%0.6",
					"M2|M1 AND CR:plasma%0.6|M2",
				],
				behaviorOn: [
					"M2|M1 AND CR:plasma%1|M2",
					"M1 AND CR:plasma%1|XX|M1 AND CR:plasma%1",
					"M2|M1 AND CR:plasma%1|M2",
				],
				tick: function(pixel) {
					almostSun(pixel,0.5,stellarPlasmaSpreadWhitelist);
				},
				temp:5500,
				tempLow:2300,
				stateLow: "plasma",
				category: "gases",
				state: "gas",
				density: 10,
				conduct: 0.5,
			};
			
			elements.neutron_star = {
				color: "#e9eaf7",
				colorOn: "#ffffbd",
				behavior: [
					"XX|CR:neutron%0.1|XX", //no neutrinos though
					"CR:neutron%0.1|XX|CR:neutron%0.1",
					"XX|CR:neutron%0.1|XX"
				],
				tick: function(pixel) {
					nsTick(pixel,0.7,stellarPlasmaSpreadWhitelist);
				},
                temp: 1e12,
                category: "special",
                state: "gas",
                density: 1e17,
                insulate: true,
				conduct: 1,
			};
			
			elements.liquid_degenerate_neutronium = {
				color: "#e9eaf7",
				behavior: [
					"XX|M2%5 AND CR:neutron%0.6|XX",
					"M2|XX|M2",
					"M1|M1|M1",
				],
				behaviorOn: [
					"XX|M2%10 AND M1%0.5 AND CR:neutron%1.2|XX",
					"M2|XX|M2",
					"M1|M1|M1",
				],
				tick: function(pixel) {
					nsTick(pixel,0.7,stellarPlasmaSpreadWhitelist);
				},
				temp:1e6,
				isGas: true,
				tempLow:2300,
				stateLow: elements.liquid_neutronium ? "liquid_neutronium" : "neutron",
				category: "liquids",
				state: "liquid",
				density: 100000, //i'm not doing any more research on these neutron stars because google is useless
				conduct: 1,
			};

			elements.gaseous_degenerate_neutronium = {
				color: "#e9eaf7",
				behavior: [
					"M2|M1 AND CR:neutron%0.6|M2",
					"M1 AND CR:neutron%0.6|XX|M1 AND CR:neutron%0.6",
					"M2|M1 AND CR:neutron%0.6|M2",
				],
				behaviorOn: [
					"M2|M1 AND CR:neutron%1|M2",
					"M1 AND CR:neutron%1|XX|M1 AND CR:neutron%1",
					"M2|M1 AND CR:neutron%1|M2",
				],
				tick: function(pixel) {
					nsTick(pixel,0.6,stellarPlasmaSpreadWhitelist);
				},
				temp:1e6,
				isGas: true,
				tempLow:2300,
				stateLow: "neutron",
				category: "gases",
				state: "gas",
				density: 10000, //i'm not doing any more research on these neutron stars because google is useless
				conduct: 1,
			};
			
			if(enabledMods.includes("mods/chem.js")) {
				elements.supernova.behavior = [
					"XX|XX|XX",
					"XX|EX:80>plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,plasma,molten_iron,molten_uranium,molten_lead AND CH:neutron_star,neutron_star,neutron_star,neutronium,quark_matter,void|XX",
					"XX|XX|XX",
				]
			};
			
			elements.plasma.noConduct = ["stellar_plasma","liquid_stellar_plasma","liquid_degenerate_neutronium","gaseous_degenerate_neutronium","neutron_star"]; //I can't suppress the charge overlay and keep the tick color, only effective with noConduct.js but not strictly required
			
		//Main preset

			worldgentypes.star = {
				layers: [
					[0.9, "stellar_plasma"],
					[0.65, "liquid_stellar_plasma"],
					[0.4, "liquid_stellar_plasma", 1/2],
					[0, "sun"],
				],
				complexity: 100,
				baseHeight: 0.3,
				temperature: 6500,
			};

	//Radioactive Desert

		//Main preset

			worldgentypes.nuclear_wasteland_desert = {
				layers: [
					[0.97, "fallout", 0.4],
					[0.95, "radioactive_gravel", 0.6],
					[0.65, "liquid_irradium", 0.01],
					[0.65, "cancer", 0.02],
					[0.65, "bone", 0.02],
					[0.65, "radioactive_sand"],
					[0.55, "cancer", 0.01],
					[0.55, "bone", 0.01],
					[0.3, "radioactive_sandstone"],
					[0.05, "radioactive_rock"],
					[-0.78, "radioactive_basalt"]
				],
				temperature: -13
			};
			


};
