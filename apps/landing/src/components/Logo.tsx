import React from "react";

// eslint-disable-next-line react/display-name
const MSLogo = React.memo(
  (props: Omit<React.ComponentProps<"svg">, "height" | "width">) => {
    return (
      <svg
        fill="none"
        viewBox="0 0 400 400"
        height="64"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <title id="ms-logo-title">Mission Sustainability logo</title>
        <circle cx="199.998" cy="199.998" r="168.276" fill="url(#a)" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M340.089 106.999c-30.118-45.3684-81.668-75.2763-140.204-75.2763-29.425 0-57.086 7.5578-81.146 20.8382.92 8.6406 3.399 19.2376 9.479 28.4762 12.944 19.6669 32.177 23.0389 59.374 23.0389h9.848c21.757 0 39.395 17.611 39.395 39.335s17.638 39.334 39.395 39.334 39.395-17.61 39.395-39.334c0-16.448 10.11-30.538 24.464-36.412ZM155.836 362.222C84.328 342.865 31.7226 277.52 31.7217 199.888H70.122c15.7796 0 28.5715 12.792 28.5715 28.572v14.285c0 15.78 12.7915 28.572 28.5715 28.572 15.78 0 28.571 12.792 28.571 28.571v62.334Zm190.184-79.068c-19.391 33.957-50.277 60.504-87.358 74.338v-45.767c0-15.779 12.792-28.571 28.572-28.571h58.786Z"
          fill="url(#b)"
        />
        <defs>
          <radialGradient
            id="a"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(45.658 -142.754737 269.82979) scale(256.343)"
          >
            <stop stopColor="#86F8FF" />
            <stop offset="1" stopColor="#2DCED8" />
          </radialGradient>
          <radialGradient
            id="b"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="matrix(0 165.25 -157.149 0 188.871 196.972)"
          >
            <stop stopColor="#61C965" />
            <stop offset="1" stopColor="#52BD56" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
);

export default MSLogo;
