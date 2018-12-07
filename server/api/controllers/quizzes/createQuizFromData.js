var LineByLineReader = require('line-by-line')
let fs = require('fs'),
  PDFParser = require("pdf2json");

let pdfParser = new PDFParser(this,1);

let questions = []
let questionObject = {}
let iterator = 0

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
  let lr = new LineByLineReader('../../key.txt');
  lr.on('error', function (err) {
    // 'err' contains error object
  });

  lr.on('line', function (line) {
    let potentialData = line[0] + line[1]
    let potentialAnswer = line[0]
    if (hasNumber(potentialData)) {
      let tmpLine = line.split(' ')
      tmpLine.splice(0, 1)
      let question = tmpLine.join(' ')
    }

    if (hasLowerCase(potentialAnswer) && line[0] + line[1] !== 'e)') {
      let tmpLine = line.split(' ')
      tmpLine.splice(0, 1)
      let answer = tmpLine.join(' ')
    }
  });

  lr.on('end', function () {

    for (var i = 0; i < 40; i ++ ) {
      let txt = text.split('\n')
      let tmpObject = {
        "question": txt[iterator],
        "correctAnswer": txt[iterator + 1],
        "answer2": txt[iterator + 2],
        "answer3": txt[iterator + 3],
        "answer4": txt[iterator + 4]
      }
      iterator += 5
    }


  });
});


let getLines = function getLines (filename, lineCount, callback) {
  let stream = fs.createReadStream(filename, {
    flags: "r",
    encoding: "utf-8",
    fd: null,
    mode: 438, // 0666 in Octal
    bufferSize: 64 * 1024
  });

  let data = "";
  let lines = [];
  stream.on("data", function (moreData) {
    data += moreData;
    lines = data.split("\n");
    // probably that last line is "corrupt" - halfway read - why > not >=
    if (lines.length > lineCount + 1) {
      stream.destroy();
      lines = lines.slice(0, lineCount); // junk as above
      callback(false, lines);
    }
  });

  stream.on("error", function () {
    callback("Error");
  });

  stream.on("end", function () {
    callback(false, lines);
  });

};


let text =
  "Which of the following best describes LHON?\n" +
  "A mutation in mitochondrial DNA\n" +
  "A defect in mitochondrial oxygen utilization\n" +
  "A mutation in chromosomal enzymes\n" +
  "Deficiency in lysosomal enzymes.\n" +
  "Gout can be caused due;\n" +
  "Accumulation of Uric acid crystals in the joints\n" +
  "A mutation in chromosomal enzymes\n" +
  "A mutation in mitochondrial DNA\n" +
  "Deficiency in lysosomal enzymes.\n" +
  "Abnormal synthesis of Lamina A can lead to\n" +
  "Progeria\n" +
  "LHON\n" +
  "Wolmans Disease\n" +
  "Peroxisomes Bigenesis Disorder\n" +
  "Lack of Lysosomal Acid Lipase can lead to.\n" +
  "Wolmans Disease\n" +
  "Progeria\n" +
  "Cholesteryl Ester Storage Disease\n" +
  "Peroxisomes Bigenesis Disorder\n" +
  "Zellweger syndrome can be attributed to the inactivity of;\n" +
  "Peroxisomes\n" +
  "Lysosomal Acid Lipase\n" +
  "urease\n" +
  "All of the above\n" +
  "A defect in mitochondrial oxygen utilization;\n" +
  "Lufts Disease\n" +
  "Lysosomal Acid Lipase deficiency\n" +
  "Peroxisomes biogenesis disorder\n" +
  "LHON\n" +
  "___________ involved in the glycerol ether type of triglycerides;\n" +
  "Peroxisomes\n" +
  "Lysosomal Acid Lipase\n" +
  "Mitochondria\n" +
  "LHON\n" +
  "___________  restricts  the  entry  of  compounds  into  the  cells  and  act  as a  barrier  between\n" +
  "matrix and the cytoplasm;\n" +
  "Cell membrane\n" +
  "Lysosomes\n" +
  "Peroxisomes\n" +
  "Plasma membrane\n" +
  "All of the following is true regarding cellular membrane, EXCEPT;\n" +
  "The polar nature of the plasma membrane restricts the entry to toxins into the cells\n" +
  "The outer surface of the cell membrane can trigger the communication with the inside of\n" +
  "cell.\n" +
  "The membrane contains many specific protein receptors on its surface,\n" +
  "Specific transport mechanism exist for the transport of selective ions or organic molecules\n" +
  "the inside of the cells\n" +
  "The membrane surrounding nucleus which is involved in protein synthesis,\n" +
  "Endoplasmic Reticulum\n" +
  "Nuclear Envelope\n" +
  "Nuclear Membrane,\n" +
  "Nucleolus\n" +
  "DNA is located in,\n" +
  "Nucleus\n" +
  "Nuclear Membrane,\n" +
  "Endoplasmic Reticulum\n" +
  "Nucleolus\n" +
  "The process of replication and repair of DNA takes place in,\n" +
  "Nucleus\n" +
  "Endoplasmic reticulum\n" +
  "mitochondria\n" +
  "peroxisomes\n" +
  "The nuclear envelope is supported by a structural protein called as,\n" +
  "Lamina A\n" +
  "Nucleolus\n" +
  "Endoplasmic reticulum\n" +
  "Peroxisomes\n" +
  "Which of the following have pores for the uptake of selective ions;\n" +
  "all of the above\n" +
  "Cell membrane\n" +
  "Nuclear envolope\n" +
  "Plasma membrane\n" +
  "The distortion in the nuclear shape can be explained due to ;\n" +
  "Abnormal Lamina A synthesis\n" +
  "Abnormal DNA synthesis\n" +
  "Abnormal plasma membrane\n" +
  "all of the above\n" +
  "Progeria is characterized by ;\n" +
  "Rapid Ageing\n" +
  "Deposition of uric acid crystals\n" +
  "Excessive sweat and weight loss\n" +
  "Hepatomegaly\n" +
  "The function of nuclear Lamina is to ;\n" +
  "All of the above\n" +
  "Regulate Cell division\n" +
  "Provide structural support\n" +
  "Involved in chromatin organization.\n" +
  "Ribosomes are present on;\n" +
  "Rough endoplasmic reticulum\n" +
  "Smooth endoplasmic reticulum\n" +
  "Both of them.\n" +
  "None of them\n" +
  "The metabolizing enzymes, CYP450 are present on\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "The triglycerides are broken down to free fatty acids by\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "The organelle involved in lipid synthesis\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "mitochondria\n" +
  "The organelle involved in the oxidation of glucose via citric acid cycle\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "Mitochondria\n" +
  "Synthesis of vesicles containing hormones, proteins, and enzymes takes place from\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "Golgi complex\n" +
  "The organelle involved in the hydrolysis/oxidation short chain lipids;\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "Mitochondria\n" +
  "The organelle involved in the oxidation long chain lipids(> 22 carbon atoms);\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "Mitochondria\n" +
  "Mitosol is present in\n" +
  "Nucleus\n" +
  "Smooth endoplasmic reticulum\n" +
  "Rough endoplasmic reticulum\n" +
  "Lysosomes.\n" +
  "Mitochondria\n" +
  "Which of the following process takes place in mitochondria\n" +
  "Oxidation of Carbohydrates\n" +
  "Oxidation of Lipids\n" +
  "Oxidation of Amino Acids\n" +
  "Biosythesis of urea\n" +
  "all of the above\n" +
  "Abnormality in mitochondria can lead to; Multiple Answers\n" +
  "Progeria\n" +
  "Luft Disease\n" +
  "LHON\n" +
  "Wolmans Disease\n" +
  "Patient  with  Luft  disease  will  show  symptoms  such  as,  weight  loss,  excessive  sweating,\n" +
  "are similar to\n" +
  "Progeria\n" +
  "Hypothyroidism\n" +
  "Hyperthyroidism\n" +
  "Wolmans Disease\n" +
  "Patient with LHON will loose __________ vision in early stages\n" +
  "Central\n" +
  "Peripheral\n" +
  "Both of them\n" +
  "all of the above\n" +
  "Orgenalle with acidic pH of 5.0\n" +
  "Mitochondria\n" +
  "Plasma membrane\n" +
  "nucleus\n" +
  "endoplasmic reticulum\n" +
  "Enzymes which can catalyze hydrolytic cleavage of carbs, lipids, proteins, and nucleic acid.\n" +
  "lysosomal acid lipase\n" +
  "Hydrolase\n" +
  "transferase\n" +
  "urease\n" +
  "Hydrolase are located in;\n" +
  "Mitochondria\n" +
  "Plasma membrane\n" +
  "Nucleus\n" +
  "Endoplasmic reticulum\n" +
  "Organelle  involved  in  breakdown of toxins  via the process  of  phagocytosis  once  they  enter\n" +
  "body;\n" +
  "Mitochondria\n" +
  "Plasma membrane\n" +
  "Nucleus\n" +
  "Endoplasmic reticulum\n" +
  "Gout;\n" +
  "Deposition of uric acid crystals\n" +
  "Lack of uric acid\n" +
  "Deficiency of Lysosomal Acid Lipase\n" +
  "All of the above\n" +
  "Uric acid can be further oxidized to allantoin by\n" +
  "Urate Oxidase\n" +
  "Hydrolase\n" +
  "Uriase\n" +
  "All of the above\n" +
  "Triglycerides and cholesteryl esters are taken up into hepatocytes using\n" +
  "LDL receptors\n" +
  "HDL receptors\n" +
  "Uriase\n" +
  "All of the above\n" +
  "Both triglycerides and cholesteryl esters are broken down in____________;\n" +
  "Mitochondria\n" +
  "Plasma membrane\n" +
  "Nucleus\n" +
  "Endoplasmic reticulum\n" +
  "Both triglycerides and cholesteryl esters are broken down by____________;\n" +
  "Urate Oxidase\n" +
  "Hydrolase\n" +
  "Uriase\n" +
  "Lysosomal Acid Lipase\n" +
  "Agent which can be used to treat hLAL deficiency.\n" +
  "Sebelipase alpha\n" +
  "Hydrolase\n" +
  "Uriase\n" +
  "None of the above\n" +
  "Organelles which can synthesize and breakdown peroxide\n" +
  "Mitochondria\n" +
  "Plasma membrane\n" +
  "Peroxisomes\n" +
  "Endoplasmic reticulum\n" +
  "Peroxisomes are involved in;\n" +
  "Synthesis of triglycerides, (Glycerol ether types)\n" +
  "Shortening very long chain fatty acids\n" +
  "Oxidation of the side chain of cholesterol needed for bile acid synthesis.\n" +
  "All of the above\n"



function hasNumber(myString) {
  return /\d/.test(myString);
}

function hasLowerCase(str) {
  return (/[a-z]/.test(str));
}

pdfParser.loadPDF("../../key.pdf");