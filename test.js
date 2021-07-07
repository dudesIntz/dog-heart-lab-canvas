import { drugs } from "./drugs";

function DogHeartLab({ canvas, step = -4, grids, height = 300, width = 700 }) {
  var canvas = canvas;
  canvas.height = height;
  canvas.width = width;
  var step = 0;
  var canvasBorder = 30;
  var padding = 15;
  this.dogs = [];
  this.antagonist = [];
  this.heartRateMaxVal = 220;
  this.heartRateMultiplesOf = 20;
  this.BPInitVal = 0;
  this.BPMaxVal = 200;
  this.BPMultiplesOf = 20;
  this.bottomSpace = 10;
  this.timerval = 200;
  this.newDogGap = 50;
  this.bpnormalVlaue = 20;
  this.hrnormalVlaue = 3;
  this.currentDrugVal = 0;
  this.drugObject = {};
  this.dogDead = false;
  this.footerIncr = 0;
  this.tempCnt = 1;
  this.dogCnt = 0;
  let { GridSize = 1, LinesSize = 1, color = "#f2f2f2" } = grids?.options || {};
  let { y = { start: 0, end: 0, gap: 10 } } = grids?.axis || {};
  const heightOfZeroValue =
    canvasBorder + ((y.end - y.start) / y.gap) * GridSize;
  const noOfHorizontalGrids = Math.floor(
    (width - canvasBorder - canvasBorder) / GridSize
  );
  const horizontalLineEnd = canvasBorder + noOfHorizontalGrids * GridSize;

  function calculateHeightInPixel(px) {
    return canvasBorder + ((y.end - px) / y.gap) * GridSize;
  }

  this.drawAxes = function (ctx, axes) {
    var i;
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var xMin = 0;

    ctx.beginPath();
    ctx.lineWidth = LinesSize;
    ctx.strokeStyle = color;
    GridSize = parseInt(grids.options.GridSize);

    // console.log(horizontalLineEnd)
    // draw horizontal lines
    for (let i = canvasBorder; i <= heightOfZeroValue; i += GridSize) {
      if (i === canvasBorder) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(canvasBorder, i + 3);
        ctx.lineTo(horizontalLineEnd, i + 3);
        ctx.lineWidth = "6";
        ctx.strokeStyle = "#797979";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      } else if (i === heightOfZeroValue) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(canvasBorder, i);
        ctx.lineTo(horizontalLineEnd, i);
        ctx.lineWidth = "2";
        ctx.strokeStyle = "#797979";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.moveTo(canvasBorder, i);
        ctx.lineTo(horizontalLineEnd, i);
        ctx.stroke();
        ctx.closePath();
      }
    }

    for (
      let i = canvasBorder, pos = y.end;
      i <= horizontalLineEnd;
      i += GridSize
    ) {
      // draw vertical lines
      //  console.log(i, horizontalLineEnd, noOfHorizontalGrids)
      if (i === canvasBorder || i === horizontalLineEnd) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(i, canvasBorder);
        ctx.lineTo(i, heightOfZeroValue);
        ctx.lineWidth = "2";
        ctx.strokeStyle = "#797979";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.moveTo(i, canvasBorder);
        ctx.lineTo(i, heightOfZeroValue);
        ctx.stroke();
        ctx.closePath();
      }

      //draw point marks eg --

      //draw left and right points
      if (pos >= 0) {
        if (pos % 20 == 0) {
          // draw for heart rate
          ctx.beginPath();
          ctx.save();
          ctx.moveTo(canvasBorder, i + 1);
          ctx.lineTo(canvasBorder + 12, i + 1);
          ctx.lineWidth = "2";
          ctx.strokeStyle = "#797979";
          ctx.stroke();
          ctx.font = "9px Arial";
          ctx.textAlign = "baseline";
          ctx.fillStyle = "red";
          ctx.fillText(pos, padding - 5, i + 4);
          ctx.restore();
          ctx.closePath();

          //draw for Mean BP
          ctx.beginPath();
          ctx.save();
          ctx.moveTo(horizontalLineEnd, i + 1);
          ctx.lineTo(horizontalLineEnd - 12, i + 1);
          ctx.lineWidth = "2";
          ctx.strokeStyle = "blue";

          ctx.font = "9px Arial";
          ctx.textAlign = "baseline";
          ctx.fillStyle = "blue";
          ctx.fillText(pos, width - canvasBorder, i + 2);
          ctx.stroke();
          ctx.restore();
          ctx.closePath();
        }

        if (pos % 10 == 0) {
          ctx.beginPath();
          ctx.save();
          ctx.moveTo(canvasBorder, i + 1);
          ctx.lineTo(canvasBorder + 7, i + 1);
          ctx.lineWidth = "2";
          ctx.strokeStyle = "#797979";
          ctx.stroke();

          ctx.restore();
          ctx.closePath();

          ctx.beginPath();
          ctx.save();
          ctx.moveTo(horizontalLineEnd, i + 1);
          ctx.lineTo(horizontalLineEnd - 7, i + 1);
          ctx.lineWidth = "2";
          ctx.strokeStyle = "blue";
          ctx.stroke();
          ctx.restore();
        }
      }
      pos -= y.gap;
    }

    ctx.beginPath();
    ctx.font = "14px Arial";
    ctx.textAlign = "baseline";
    ctx.fillStyle = "red";
    ctx.fillText("Heart Rate (bpm)", canvasBorder, heightOfZeroValue + padding);

    ctx.closePath();

    ctx.beginPath();
    ctx.font = "14px Arial";
    ctx.textAlign = "baseline";
    ctx.fillStyle = "blue";
    const text = "Mean BP (mm Hg)";

    ctx.fillText(
      text,
      horizontalLineEnd - ctx.measureText(text).width,
      heightOfZeroValue + padding
    );

    ctx.closePath();

    // ctx.stroke();
  };

  this.convertCanvasToImage = function () {
    if (!canvas) return false;
    let image = new Image();
    image.src = canvas.toDataURL();
    return image;
  };

  this.canvas_arrow = function (context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(tox, toy);
    context.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6)
    );
    context.closePath();
  };

  this.plotSine = function (ctx, xOffset, yOffset) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var scale = 20;

    ctx.beginPath();
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = "rgb(66,44,255)";

    // console.log("Drawing point...");
    // drawPoint(ctx, yOffset+step);

    var singleGridSizeHR = horizontalLineEnd;
    var HR_x = horizontalLineEnd;
    var HR_y = 0;
    var HR_amplitude = 20;
    // var frequency = 0.1;
    // var amplitude = 40;
    var HR_frequency = 0.1;

    var singleGridSizeBP = horizontalLineEnd;
    var BP_x = horizontalLineEnd;
    var BP_y = 0;
    var BP_amplitude = 2;
    var BP_frequency = 0.1;

    // console.log(this.dogs)
    this.dogs.forEach((dogs) => {
      //
      ctx.beginPath();
      ctx.fillText(dogs.numOfDogtxt, HR_x, calculateHeightInPixel(200));
      ctx.closePath();
      dogs.drugs.forEach((drug) => {
        ctx.moveTo(HR_x, calculateHeightInPixel(120));

        drug.DoseValArray.forEach((val) => {
          while (HR_x > singleGridSizeHR - GridSize) {
            const slope = HR_x / (singleGridSizeHR - GridSize);
            HR_y =
              calculateHeightInPixel(120) +
              val * slope +
              HR_amplitude * Math.sin((HR_x + val) / HR_frequency);
            ctx.lineTo(HR_x, HR_y);
            HR_x--;
          }
          singleGridSizeHR -= GridSize;
        });

        ctx.stroke();
        ctx.save();
        ctx.moveTo(BP_x, calculateHeightInPixel(138));
        drug.HrValArray.forEach((val) => {
          while (BP_x > singleGridSizeBP - GridSize) {
            BP_y =
              calculateHeightInPixel(138) +
              BP_amplitude * Math.sin((BP_x + val) / BP_frequency);
            ctx.lineTo(BP_x, BP_y);
            BP_x--;
          }
          singleGridSizeBP -= GridSize;
        });
        ctx.stroke();
        ctx.restore();
      });
      BP_x -= 3 * GridSize;
      HR_x -= 3 * GridSize;
    });
    // console.log(HR_x);
    //ctx.moveTo(x, y);

    // while (x < width) {

    //   HR_x++;
    //   // console.log("x="+x+" y="+y);
    // }
    ctx.stroke();
    ctx.save();
    // drawPoint(ctx, y);
    ctx.stroke();
    ctx.restore();
  };

  this.draw = function () {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, width, height);
    this.drawAxes(context);
    context.save();

    this.plotSine(context, 10, 50);
    context.restore();

    step += 1;
    window.requestAnimationFrame(this.draw.bind(this));
  };

  this.getDrug = function (drugName) {
    return drugs.drug.filter((val) => val.drug_name === drugName);
  };

  this.addDog = function () {
    // const newDog = drugs.drug
    this.currentActingDrug = {};
    this.dogDeadFlg = false;

    var DoseValArray = [0, 0, 0,];
    var HrValArray = [0, 0, 0];
    var TimingArray = [1, 3, 3];

    const newDog = {
      numOfDogtxt: `Dog No:
      ${this.dogs.length + 1}`,
      startPos: 120,
      drugCode: "normalnew",
      val: "",
      drugs: [
        {
          DoseValArray,
          HrValArray,
          TimingArray,
        },
      ],

      drugDose: 0,
    };
    this.dogs.push(newDog);
    // this.antagonist
  };

  this.shuffleArray = function (arr) {
    var arr2 = [];
    while (arr.length > 0) {
      arr2.push(arr.splice(Math.round(Math.random() * arr.length - 1), 1)[0]);
    }
    return arr2;
  };

  this.getArrayByGroup = function () {
    var group_1 = [];
    var group_2 = [];
    var group_3 = [];
    var group_4 = [];
    var group_5 = [];
    var group_6 = [];
    var tempArr = [];
    drugs.drug.forEach((thing) => {
      if (thing.drug_type != "Pro") {
        switch (thing.group.toString()) {
          case "1":
            group_1.push(thing);
            break;
          case "2":
            group_2.push(thing);
            break;
          case "3":
            group_3.push(thing);
            break;
          case "4":
            group_4.push(thing);
            break;
          case "5":
            group_5.push(thing);
            break;
          case "6":
            group_6.push(thing);
            break;
          default:
            break;
        }
        //eval["group_"+groupNum].push(thing)
        //tempArray.push(thing);
      }
    });

    const [group_1_index] = this.shuffleArray(group_1);
    const [group_2_index] = this.shuffleArray(group_2);
    const [group_3_index] = this.shuffleArray(group_3);
    const [group_4_index] = this.shuffleArray(group_4);
    const [group_5_index] = this.shuffleArray(group_5);
    const [group_6_index] = this.shuffleArray(group_6);

    tempArr.push(
      group_1_index,
      group_2_index,
      group_3_index,
      group_4_index,
      group_5_index,
      group_6_index
    );

    return tempArr;
  };

  this.injectSaline = function () {};

  this.init = function () {
    let getArray = this.getArrayByGroup();
    getArray = this.shuffleArray(getArray);
    console.log(getArray.splice(5, 1));
    this.antagonist = drugs.drug.filter((val) => val.drug_type === "Ant");
    this.draw();
    this.addDog();
  };
}

new DogHeartLab({
  canvas: document.getElementById("canvas"),
  height: 400,
  width: 800,
  grids: {
    options: {
      color: "#f2f2f5",
      GridSize: 16,
      LinesSize: 1,
    },
    axis: {
      y: { start: 0, gap: 10, end: 220 },
    },
  },
}).init();
