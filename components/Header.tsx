import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center py-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                AI Style Transfer Studio
            </h1>
            <p className="text-lg text-gray-400">
                Blend the style of one photo with the content of another.
            </p>
        </header>
    );
};

export default Header;