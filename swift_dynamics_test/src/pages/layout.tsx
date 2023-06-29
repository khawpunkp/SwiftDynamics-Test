import { Row, Col, Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./layout.css";

function LayoutPage(props: any) {
    const { t } = useTranslation();

    // Constant to triggered Move Position
    const [movePosition, setMovePosition] = useState<boolean>(false);

    // Array of the shapes
    const [shape, setShape] = useState<string[]>([
        "parallelogram",
        "rectangle",
        "trapezoid",
        "oval",
        "circle",
        "square",
    ]);

    // Index of the first row and the second row
    const [firstRowIndex, setFirstRowIndex] = useState<number[]>([0, 1, 2]);
    const [secondRowIndex, setSecondRowIndex] = useState<number[]>([3, 4, 5]);

    // Randomize the shape
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

    // Randomize the shape when the page is loaded
    useEffect(() => {
        handleRandomShape();
    }, []);

    // Move Shape to the Left
    const handleMoveLeft = () => {
        setShape((prevShape) => {
            const updatedShape = [...prevShape]; // Create a copy of the array
            const lastShape = updatedShape.shift(); // Remove and retrieve the frist element
            if (lastShape) {
                updatedShape.push(lastShape); // Add the first element to the last position
            }
            return updatedShape;
        });
    };

    // Move Shape to the Right
    const handleMoveRight = () => {
        setShape((prevShape) => {
            const updatedShape = [...prevShape]; // Create a copy of the array
            const lastShape = updatedShape.pop(); // Remove and retrieve the last element
            if (lastShape) {
                updatedShape.unshift(lastShape); // Add the last element to the first position
            }
            return updatedShape;
        });
    };

    /* Handle Move Position by Swapping Row */
    const handleMovePosition = () => {
        // Switch the movePosition state
        setMovePosition(!movePosition);
        // Swap the first row and the second row
        const temp = firstRowIndex;
        setFirstRowIndex(secondRowIndex);
        setSecondRowIndex(temp);
    };

    return (
        <>
            {/* Render a loading  */}
            {props.loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100vh",
                    }}
                >
                    <h1>Loading...</h1>
                </div>
            ) : (
                <>
                    {/* Page Title */}
                    <div style={{ position: "relative" }}>
                        <h1
                            style={{
                                position: "absolute",
                                left: "10px",
                            }}
                        >
                            {t("layout")}
                        </h1>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "100vh",
                        }}
                    >
                        <div>
                            {/* Control Button */}
                            <Row>
                                {/* Move Left Button */}
                                <Button
                                    className="ShapeContainer"
                                    style={{ position: "relative" }}
                                    onClick={() => handleMoveLeft()}
                                >
                                    <div className="ButtonFooter">{t("move_shape")}</div>
                                    <div className="tri-left" />
                                </Button>
                                {/* Move Position Button */}
                                <Button
                                    className="ShapeContainerWide"
                                    style={{ position: "relative" }}
                                    onClick={() => handleMovePosition()}
                                >
                                    <div className="ButtonFooter">{t("move_position")}</div>
                                    <Row gutter={50} justify="space-between">
                                        <div
                                            style={{
                                                width: "300px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div className="tri-up" />
                                        </div>
                                        <div
                                            style={{
                                                width: "300px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <div className="tri-down" />
                                        </div>
                                    </Row>
                                </Button>
                                {/* Move Right Button */}
                                <Button
                                    className="ShapeContainer"
                                    style={{ position: "relative" }}
                                    onClick={() => handleMoveRight()}
                                >
                                    <div className="ButtonFooter">{t("move_shape")}</div>
                                    <div className="tri-right" />
                                </Button>
                            </Row>
                        </div>
                        <hr
                            style={{
                                height: "1px",
                                width: "1220px",
                                borderWidth: "0",
                                color: "gray",
                                backgroundColor: "gray",
                                opacity: "0.3",
                                marginTop: "40px",
                                marginBottom: "16px",
                            }}
                        />
                        <div>
                            {/* Render the shapes */}

                            {/* First Row of Shape */}
                            <Row
                                gutter={10}
                                style={{ marginLeft: movePosition ? "0" : "100px" }} // Swap position using margin bases on movePosition state
                            >
                                <Col>
                                    <Button
                                        className="ShapeContainer"
                                        onClick={() => handleRandomShape()}
                                    >
                                        <div className={shape[firstRowIndex[0]]} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        className="ShapeContainer"
                                        onClick={() => handleRandomShape()}
                                    >
                                        <div className={shape[firstRowIndex[1]]} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        className="ShapeContainer"
                                        onClick={() => handleRandomShape()}
                                    >
                                        <div className={shape[firstRowIndex[2]]} />
                                    </Button>
                                </Col>
                            </Row>

                            {/* Second Row of Shape */}
                            <Row
                                gutter={10}
                                style={{ marginLeft: movePosition ? "100px" : "0" }} // Swap position using margin bases on movePosition state
                            >
                                <Col>
                                    <Button
                                        className="ShapeContainer"
                                        onClick={() => handleRandomShape()}
                                    >
                                        <div className={shape[secondRowIndex[0]]} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        className="ShapeContainer"
                                        onClick={() => handleRandomShape()}
                                    >
                                        <div className={shape[secondRowIndex[1]]} />
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        className="ShapeContainer"
                                        onClick={() => handleRandomShape()}
                                    >
                                        <div className={shape[secondRowIndex[2]]} />
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default LayoutPage;
