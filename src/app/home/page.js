import React from "react";

const DarkModePaletteDemo = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary p-8">
      {/* Header */}
      <header className="bg-background-secondary p-4 rounded-lg mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dark Mode UI</h1>
        <button className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded">
          Get Started
        </button>
      </header>

      {/* Main Content */}
      <main>
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-background-tertiary p-6 rounded-lg border-4 border-border-primary">
            <h2 className="text-xl font-semibold mb-2">Primary Card</h2>
            <p className="text-text-secondary">
              This is a primary card with subtle borders and muted text.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-background-tertiary p-6 rounded-lg border-4 border-primary">
            <h2 className="text-xl font-semibold mb-2 text-primary">
              Highlighted Card
            </h2>
            <p className="text-text-secondary">
              This card has a highlighted border and accent color text.
            </p>
            <p className="text-text-muted">Muted Text</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Interactive Buttons</h3>
          <div className="flex space-x-4">
            <button className="bg-button hover:bg-button-hover text-white px-4 py-2 rounded">
              Primary Button
            </button>
            <button className="bg-button-disabled text-white px-4 py-2 rounded cursor-not-allowed">
              Disabled Button
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-text-muted">
        © 2024 Dark Mode Design. All rights reserved.
      </footer>
    </div>
  );
};

export default DarkModePaletteDemo;
