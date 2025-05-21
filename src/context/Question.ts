import RtiImage1 from "../assets/rti/rti1.png";
import RtiImage2 from "../assets/rti/rti2.png";
import RtiImage3 from "../assets/rti/rti3.png";
import RtiImage4 from "../assets/rti/rti4.png";
import RtiImage5 from "../assets/rti/rti5.png";
import RtiImage6 from "../assets/rti/rti6.png";
import RPImage1 from "../assets/rp/rp-1.png";
import RPImage2 from "../assets/rp/rp-2.png";
import RPImage3 from "../assets/rp/rp-3.png";
import RPImage4 from "../assets/rp/rp-4.png";
export type Option = {
  text: string;
  Des: string | null;
};
export type SelectedOption = {
  option: Option;
  index: number;
};
export type Question = {
  text: string;
  options: Option[];
  selectedOption?: SelectedOption | null;
  Img: string;
};
const RTIAnswerKey: { [questionIndex: number]: string } = {
  0: "Sell the Stock", // Question 1: option index 2 is correct ("Sell the Stock")
  1: "Yes Will review the portfolio", // Question 2: option index 2 ("Yes Will review the portfolio")
  2: "Sell the Stock", // Question 3: option index 1 ("Sell the Stock")
  3: "Will not buy", // Question 4: option index 2 ("Will not buy")
  4: "Find out the reason for difference and then choose", // Question 5: option index 2 ("Find out the reason and then choose")
  5: "No", // Question 6: option index 1 ("No")
};

const RtiQuestionList: Question[] = [
  {
    text: "You had bought Company Stock XNB at INR 100 six months back, In last two quarterly results it has shown losses and business prospects for the company XNB are not looking good. The Stock price has fallen to INR 80. What will you do ?",
    options: [
      {
        text: "Buy more at INR 80 to average out.",
        Des: "Example of Bias – Sunk Cost fallacy. One keeps averaging out the stocks just for Psychological Comfort and hoping it would go up. Before Averaging out, one should think that Whether the stock is worth considering for Fresh Purchase at the given price level.",
      },
      {
        text: "Hold the Stock",
        Des: "Status Quo bias - A preference to keep things the way they are, even when change might be beneficial.",
      },
      {
        text: "Sell the Stock",
        Des: "This is a more logical and rational behaviour towards the stock.",
      },
    ],

    selectedOption: null,
    Img: RtiImage1,
  },
  {
    text: "You have an investment portfolio which you have not reviewed from a long time thinking it’s for long term. We suggest you to review the portfolio to see if any rebalancing is required?",
    options: [
      {
        text: "No need to review the portfolio as have made it for long term.",
        Des: "Example of Bias - Status Quo Bias. A fancy name for Inertia. One just doesn’t want to change the status quo.",
      },
      {
        text: "May Be",
        Des: "Ostrich effect - Avoiding information that may cause psychological discomfort — like an ostrich burying its head in the sand.",
      },
      {
        text: "Yes Will review the portfolio",
        Des: "Logical Thinking and Rational behaviour",
      },
    ],

    selectedOption: null,
    Img: RtiImage2,
  },
  {
    text: "You are holding a Stock which you had bought after doing research yourself. Most of the Stock Analyst are giving a SELL recommendation on the stock. What will you do?",
    options: [
      {
        text: "Ignore the recommendation",
        Des: "Example of Bias – Overconfidence Bias. Illusory belief in one’s capabilities.",
      },
      {
        text: "Review the Stock",
        Des: "Overconfidence bias",
      },
      {
        text: "Sell the Stock",
        Des: "Logical Thinking and Rational behaviour",
      },
    ],

    selectedOption: null,
    Img: RtiImage3,
  },
  {
    text: "Your Boss and colleagues have bought Artefacts/Antiques that they expect to become highly priced in the Future. What will you do?",
    options: [
      {
        text: "Will buy the Artefacts/Antiques",
        Des: "Example of Bias – Loss Aversion Bias. A fancier name for the bias can called as FOMO. One fearing to miss out on potential gain.",
      },
      {
        text: "Will do research",
        Des: "Social Proof bias - The tendency to look to others' behavior (especially in uncertain situations) to guide your own decisions.",
      },
      {
        text: "Will not buy",
        Des: "Logical Thinking and Rational behaviour",
      },
    ],

    selectedOption: null,
    Img: RtiImage4,
  },
  {
    text: "Suppose, you are going to take a Cruise Boat Ride at a famous Water Park. First Counter, Gives the Ride ticket at INR 100 and Second Counter gives the Ride Ticket at INR 400. What will you Choose?",
    options: [
      {
        text: "Buy Ticket from First Counter at INR 100",
        Des: "Example of Bias – Anchoring Bias. Relying too heavily on the first piece of information; Interpreting newer information from the reference point of our anchor instead of seeing it Objectively.",
      },
      {
        text: "Buy from Second Counter at INR 400",
        Des: "Example of bias – Pricing Bias. Products with higher price perceived as more valuable and lower price as less valuable.",
      },
      {
        text: "Find out the reason for difference and then choose",
        Des: "Logical Thinking and Rational behaviour",
      },
    ],

    selectedOption: null,
    Img: RtiImage5,
  },
  {
    text: "A famous company ABC stock has fallen almost 70% from its high levels. The company is expected to get Monetary help from Institutional Bodies. Lot of Investors have invested at different price levels since the fall began. Would you be interested to buy the stock?",
    options: [
      {
        text: "Yes",
        Des: "Example of Bias – Social Proof Bias. Complying to Social Norms. We look at what others are doing when taking actions to feel Psychologically safe.",
      },
      {
        text: "No",
        Des: "Logical Thinking and Rational behaviour",
      },
    ],

    selectedOption: null,
    Img: RtiImage6,
  },
];
const RiskProfileQuestionList: Question[] = [
  {
    text: "How much knowledge you have of Financial Markets ?",
    options: [
      {
        text: "I have very little or no knowledge of Markets",
        Des: null,
      },
      {
        text: "I have experience but don’t understand the markets",
        Des: null,
      },
      {
        text: " I have good understanding of the Markets",
        Des: null,
      },
      {
        text: "I have experience and understanding of the Markets",
        Des: null,
      },
    ],

    selectedOption: null,
    Img: RPImage1,
  },
  {
    text: "For what period you want to invest majority of your money",
    options: [
      {
        text: " Less than 1 Year",
        Des: null,
      },
      {
        text: "1-3 Years",
        Des: null,
      },
      {
        text: "3-5 Years",
        Des: null,
      },
      {
        text: "More than 5 Years",
        Des: null,
      },
    ],

    selectedOption: null,
    Img: RPImage2,
  },
  {
    text: "In the short term, How much volatility you are comfortable with regard to your portfolio returns?",
    options: [
      {
        text: "No Volatility",
        Des: null,
      },
      {
        text: "Minus 5% - Plus 10%",
        Des: null,
      },
      {
        text: "Minus 10% - Plus 15%",
        Des: null,
      },
      {
        text: "Minus 15% - Plus 25%",
        Des: null,
      },
    ],

    selectedOption: null,
    Img: RPImage3,
  },
  {
    text: "What degree of Risk you have taken with your financial decisions in the Past?",
    options: [
      {
        text: "No Risk taken earlier",
        Des: null,
      },
      {
        text: "Small risks",
        Des: null,
      },
      {
        text: "Medium risk",
        Des: null,
      },
      {
        text: "Large Risk",
        Des: null,
      },
    ],

    selectedOption: null,
    Img: RPImage4,
  },
];

export { RtiQuestionList, RiskProfileQuestionList, RTIAnswerKey };
