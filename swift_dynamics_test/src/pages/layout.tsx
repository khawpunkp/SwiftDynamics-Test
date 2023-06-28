import { Row, Col } from 'antd';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import './layout.css';

function LayoutPage() {
    const { t } = useTranslation();
    const [moveUp, setMoveUp] = useState<boolean>(false);
    const [shape, setShape] = useState<string[]>(["parallelogram", "rectangle", "trapezoid", "oval", "circle", "square"]);
    const [firstRowIndex, setFirstRowIndex] = useState<number[]>([0, 1, 2])
    const [secondRowIndex, setSecondRowIndex] = useState<number[]>([3, 4, 5])

    const handleRandomShape = () => {
        setShape((prevShape) => {
            const updatedShape = [...prevShape]; // Create a copy of the array

            // Fisher-Yates shuffle algorithm
            for (let i: number = updatedShape.length - 1; i > 0; i--) {
                const j: number = Math.floor(Math.random() * (i + 1));
                [updatedShape[i], updatedShape[j]] = [updatedShape[j], updatedShape[i]];
            }

            return updatedShape; // Return the shuffled array
        });
    };

    useEffect(() => {
        handleRandomShape();
    }, []);

    const handleMoveLeft = () => {
        setShape(prevShape => {
            const updatedShape = [...prevShape]; // Create a copy of the array
            const lastShape = updatedShape.shift(); // Remove and retrieve the frist element
            if (lastShape) {
                updatedShape.push(lastShape); // Add the first element to the last position
            }
            return updatedShape;
        });
    };

    const handleMoveRight = () => {
        setShape(prevShape => {
            const updatedShape = [...prevShape]; // Create a copy of the array
            const lastShape = updatedShape.pop(); // Remove and retrieve the last element
            if (lastShape) {
                updatedShape.unshift(lastShape); // Add the last element to the first position
            }
            return updatedShape;
        });
    };



    const handleMoveUp = () => {
        setMoveUp(!moveUp);
        const temp = firstRowIndex;
        setFirstRowIndex(secondRowIndex);
        setSecondRowIndex(temp);
        console.log(shape[firstRowIndex[0]]);
    }

    return (
        <>
            <div style={{ position: 'relative' }}>
                <h1 style={{ position: 'absolute', left: '10px' }}>
                    {t('layout')}
                </h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div>
                    <Row>
                        <button className='ShapeContainer' style={{ position: 'relative' }} onClick={() => handleMoveLeft()}>
                            <div className='ButtonFooter'>{t('move_shape')}</div>
                            <div className='tri-left' />
                        </button>
                        <button className='ShapeContainerWide' style={{ position: 'relative' }} onClick={() => handleMoveUp()}>
                            <div className='ButtonFooter'>{t('move_position')}</div>
                            <Row gutter={50} justify="space-between">
                                <div style={{ width: "300px", display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                    <div className='tri-up' />
                                </div>
                                <div style={{ width: "300px", display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                    <div className='tri-down' />
                                </div>
                            </Row>
                        </button>
                        <button className='ShapeContainer' style={{ position: 'relative' }} onClick={() => handleMoveRight()}>
                            <div className='ButtonFooter'>{t('move_shape')}</div>
                            <div className='tri-right' />
                        </button>
                    </Row>
                </div>
                <hr style={{ height: '1px', width: '1220px', borderWidth: '0', color: 'gray', backgroundColor: 'gray', opacity: '0.3', marginTop: '40px', marginBottom: '16px' }} />
                <div>
                    <Row gutter={10} style={{ marginLeft: moveUp ? '0' : '100px' }}>
                        <Col >
                            <button className='ShapeContainer' onClick={() => handleRandomShape()}>
                                <div className={shape[firstRowIndex[0]]}></div>
                            </button>
                        </Col>
                        <Col >
                            <button className='ShapeContainer' onClick={() => handleRandomShape()}>
                                <div className={shape[firstRowIndex[1]]}></div>
                            </button>
                        </Col>
                        <Col >
                            <button className='ShapeContainer' onClick={() => handleRandomShape()}>
                                <div className={shape[firstRowIndex[2]]}></div>
                            </button>
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginLeft: moveUp ? '100px' : '0' }}>
                        <Col >
                            <button className='ShapeContainer' onClick={() => handleRandomShape()}>
                                <div className={shape[secondRowIndex[0]]}></div>
                            </button>
                        </Col>
                        <Col >
                            <button className='ShapeContainer' onClick={() => handleRandomShape()}>
                                <div className={shape[secondRowIndex[1]]}></div>
                            </button>
                        </Col>
                        <Col >
                            <button className='ShapeContainer' onClick={() => handleRandomShape()}>
                                <div className={shape[secondRowIndex[2]]}></div>
                            </button>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default LayoutPage