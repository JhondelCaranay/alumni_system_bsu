import React from "react";

const ChatMessage = () => {
  return (
    <div className="flex">
      <div className="flex w-[70px] mt-2">
        <img
          src="/images/logo.png"
          alt="user profile"
          className="h-12 w-12 object-cover"
        />
      </div>
      <div className="flex flex-col w-full">
        <h1 className="text-[1em]">Andro Eugenio</h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex saepe
          maxime sunt quia officia error repudiandae quae quibusdam dolores
          expedita assumenda nulla odio dicta incidunt reprehenderit dolorem,
          quis neque quas ab? Vero quam a commodi culpa molestiae delectus earum
          minus, dolor eligendi voluptatum quod sequi quibusdam eos modi, quia
          iusto.
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
