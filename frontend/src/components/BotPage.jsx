import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function BotPage() {
    const sq = Array(9).fill(null);
    const [winner, setWinner] = useState(-1);
    const squaresRef = useRef([]);
    let botWorking = false;
    let block = false;

    const handleClick = (e, i) => {
        if (sq[i] == null && winner === -1 && botWorking === false) {
            sq[i] = 0;
            squaresRef.current[i].innerText = 0;
            checkWinner(sq);

            if (winner == -1) {
                botWorking = true;
                callForBot();
            }
        }
    };

    const callForBot = async () => {
        const genAI = new GoogleGenerativeAI('AIzaSyBC6zuoUtwEA4O0_opzgfm58tl5mkdqRtA');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const formattedString = sq
            .map((value, index) => `[value=${value}, index=${index}]`)
            .join(', ');

        const prompt = `You are playing Tic Tac Toe. Your goal is to win aggressively and block the opponent from winning. The board is represented as an array: ${formattedString}. Each element can be 'X', 'O', or null (empty). Your task is to pick an empty spot (null) and make the best move to maximize your chances of winning or blocking the opponent. Return the 0-based index of your next move (a number between 0 and 8). Do not return any additional text, explanation, or details. Only return the index number as a number, without any quotes or symbols.`;

        const result = await model.generateContent(prompt);
        let i = Number(result.response.text());
        if (sq[i] == null && winner === -1) {
            sq[i] = 'X';
            if (block == false) {
                console.log(winner);

                squaresRef.current[i].innerText = 'X';
            }
            checkWinner(sq);
            botWorking = false;
        }
    };

    const checkWinner = (arr) => {
        if (arr[0] === arr[1] && arr[1] === arr[2] && arr[0] !== null) {
            setWinner(arr[0]);
            block = true;
            return;
        }
        if (arr[3] === arr[4] && arr[4] === arr[5] && arr[3] !== null) {
            setWinner(arr[3]); block = true;
            return;
        }
        if (arr[6] === arr[7] && arr[7] === arr[8] && arr[6] !== null) {
            setWinner(arr[6]); block = true;
            return;
        }
        if (arr[0] === arr[3] && arr[3] === arr[6] && arr[0] !== null) {
            setWinner(arr[0]); block = true;
            return;
        }
        if (arr[1] === arr[4] && arr[4] === arr[7] && arr[1] !== null) {
            setWinner(arr[1]); block = true;
            return;
        }
        if (arr[2] === arr[5] && arr[5] === arr[8] && arr[2] !== null) {
            setWinner(arr[2]); block = true;
            return;
        }
        if (arr[0] === arr[4] && arr[4] === arr[8] && arr[0] !== null) {
            setWinner(arr[0]); block = true;
            return;
        }
        if (arr[2] === arr[4] && arr[4] === arr[6] && arr[2] !== null) {
            setWinner(arr[2]); block = true;
            return;
        }
    };

    const boardVariants = {
        initial: { opacity: 0, scale: 0.8 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <>
            <h1 className="text-center text-3xl font-semibold mb-6">Tic Tac Toe - AI Bot (Buggy "Highly")</h1>
            <div className="flex flex-col items-center space-y-6 md:space-y-0 md:flex-row md:items-start md:justify-center md:space-x-6 p-4">
                {/* Player Profile: Me */}
                <div className="text-center bg-gray-800/50 rounded-lg p-4 w-full max-w-xs md:max-w-sm">
                    <img src="https://via.placeholder.com/100" alt="Me" className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white">Me</h2>
                    <p className="text-gray-400">Symbol: X</p>
                    <p className="text-gray-400">Score: 0</p>
                    <div className="text-green-500">Active</div>
                </div>

                {/* Board */}
                <motion.div
                    variants={boardVariants}
                    initial="initial"
                    animate="animate"
                    className="grid grid-cols-3 gap-2 p-3 bg-gray-800/50 rounded-2xl backdrop-blur-sm w-full max-w-xs md:max-w-sm"
                >
                    {sq.map((_, i) => (
                        <div
                            key={i}
                            ref={(el) => (squaresRef.current[i] = el)}
                            onClick={(e) => handleClick(e, i)}
                            className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center text-white text-2xl cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                            {/* Square Content (Empty for now) */}
                        </div>
                    ))}
                </motion.div>

                {/* Player Profile: Bot */}
                <div className="text-center bg-gray-800/50 rounded-lg p-4 w-full max-w-xs md:max-w-sm">
                    <img src="https://via.placeholder.com/100" alt="Bot" className="w-16 h-16 rounded-full mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white">Bot</h2>
                    <p className="text-gray-400">Symbol: O</p>
                    <p className="text-gray-400">Score: 0</p>
                    <div className="text-red-500">Inactive</div>
                </div>
            </div>

            {/* Winner Display */}
            {winner !== -1 && (
                <div className="mt-6 text-center text-2xl font-bold text-white">
                    {winner === 'X' ? 'Bot Win!' : 'You Wins!'}
                </div>
            )}
        </>
    );
}

export default BotPage;
