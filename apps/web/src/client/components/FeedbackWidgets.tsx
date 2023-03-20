import { Button, H2 } from "@untitledui/core";

type Props = {
  heading: string;
  icon: React.ReactElement;
  description: string;
  url: string;
  btnLabel: string;
};

const Widget = ({ heading, description, icon, url, btnLabel }: Props) => {
  return (
    <div className="px-4 lg:px-10">
      <div className="mb-8 flex space-x-2 items-start justify-between">
        <p className="text-3xl font-bold leading-snug text-gray-800">
          {heading}
        </p>
        <div className="mt-1 md:mt-4 h-10 w-10 md:h-14 md:w-14 flex-shrink-0">
          {icon}
        </div>
      </div>
      <p className=" text-gray-600 mb-4">{description}</p>
      <Button
        type="secondary-gray"
        tag="link"
        href={url}
        className="inline-block"
        target="_blank"
      >
        {btnLabel}
      </Button>
    </div>
  );
};

const config: Props[] = [
  {
    heading: "Add your platform to our repository",
    btnLabel: "Send details",
    description:
      "Our goal is to give more visibility of green initiatives for eco-concious consumers.",
    icon: (
      <svg viewBox="0 0 62 59" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M27.3769 3.15067C28.5173 -0.359087 33.4827 -0.359087 34.6231 3.15067L39.1253 17.007C39.6353 18.5766 41.098 19.6393 42.7483 19.6393H57.3178C61.0081 19.6393 62.5425 24.3617 59.5569 26.5308L47.77 35.0945C46.4348 36.0646 45.8761 37.7841 46.3861 39.3537L50.8883 53.21C52.0287 56.7198 48.0117 59.6383 45.0261 57.4692L33.2392 48.9055C31.904 47.9354 30.096 47.9354 28.7608 48.9055L16.9739 57.4692C13.9883 59.6383 9.97127 56.7198 11.1117 53.21L15.6139 39.3537C16.1239 37.7841 15.5652 36.0646 14.23 35.0945L2.44306 26.5308C-0.542512 24.3617 0.991872 19.6393 4.68225 19.6393H19.2517C20.902 19.6393 22.3647 18.5766 22.8747 17.007L27.3769 3.15067Z"
          fill="url(#paint0_radial_1310_7767)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_1310_7767"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(31 32) rotate(90) scale(40)"
          >
            <stop stopColor="#FFF7AD" />
            <stop offset="1" stopColor="#FFE600" />
          </radialGradient>
        </defs>
      </svg>
    ),
    url: "https://missionsustainability.notion.site/Business-submission-in-eco-repository-530bb0787cb6400ba4b169478e68343d",
  },
  {
    heading: "Tell us how can we improvise",
    btnLabel: "Submit feedback",
    description:
      "Our goal is to give more visibility of green initiatives for eco-concious consumers.",
    icon: (
      <svg viewBox="0 0 65 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          opacity="0.9"
          d="M52.5832 53.3253C52.0454 53.0365 51.408 53.0106 50.8349 53.2209C46.1576 54.9372 41.0098 55.032 36.2553 53.4718C31.1945 51.8109 26.9306 48.39 24.2706 43.8564C21.6106 39.3228 20.7391 33.9911 21.821 28.8704C22.9029 23.7496 25.8631 19.1951 30.1415 16.0687C34.4198 12.9424 39.7194 11.4612 45.0373 11.9054C50.3552 12.3497 55.3224 14.6885 58.9988 18.4794C62.6753 22.2702 64.8059 27.25 64.9874 32.4763C65.1563 37.3412 63.6256 42.1055 60.6668 45.9891C60.254 46.5309 60.0991 47.233 60.2908 47.8867L62.2606 54.6048C62.7669 56.3316 60.9406 57.8133 59.3552 56.9619L52.5832 53.3253Z"
          fill="url(#paint0_linear_1310_7778)"
        />
        <path
          d="M15.2096 50.1687C15.7554 49.8691 16.4069 49.8415 16.9885 50.0636C22.5164 52.1741 28.615 52.3059 34.2437 50.4177C40.1847 48.4247 45.1902 44.3196 48.3128 38.8793C51.4354 33.439 52.4585 27.0409 51.1884 20.896C49.9184 14.7511 46.4433 9.28563 41.4209 5.53404C36.3985 1.78244 30.1772 0.00499347 23.9345 0.538081C17.6917 1.07117 11.8607 3.87781 7.54484 8.42682C3.22903 12.9758 0.727909 18.9516 0.514827 25.2232C0.313878 31.1376 2.16097 36.9282 5.72439 41.6214C6.12902 42.1543 6.27826 42.8439 6.09376 43.4871L3.45766 52.6774C2.96062 54.4102 4.80249 55.8816 6.38275 55.0141L15.2096 50.1687Z"
          fill="url(#paint1_linear_1310_7778)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1310_7778"
            x1="25.6525"
            y1="22.7527"
            x2="60.1264"
            y2="55.1987"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#90D64A" />
            <stop offset="1" stopColor="#A1F052" stopOpacity="0.77" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1310_7778"
            x1="63.168"
            y1="33.9052"
            x2="4.35969"
            y2="41.0028"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4DAFD5" />
            <stop offset="1" stopColor="#78F2F9" />
          </linearGradient>
        </defs>
      </svg>
    ),
    url: "https://www.notion.so/missionsustainability/Feedback-5e42386710af46609894a0d61c9b98b9",
  },
];

const FeedbackWidgets = () => {
  return (
    <div className="max-w-7xl grid gap-24 md:grid-cols-2 mb-24 mt-20">
      {config.map((props) => (
        <Widget key={props.heading} {...props} />
      ))}
    </div>
  );
};

export default FeedbackWidgets;
