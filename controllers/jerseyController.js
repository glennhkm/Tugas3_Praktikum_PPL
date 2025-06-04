import Jerseys from "../models/jerseysModel.js";
import response from "../helpers/response.js";

const getJerseyList = (req, res) => {
    try {
        const grade = req.query.grade;
        const kitType = req.query.kitType;

        if (grade && kitType) {
            const jersey = Jerseys.filter((jersey) => jersey.Grade === grade && jersey["Kit Type"] === kitType);

            if (!jersey) {
                return response.sendErrorNotFound(res, {
                    message: `Jersey with grade ${grade} and kit type ${kitType} not found`
                });
            }

            return response.sendSuccess(res, {
                message: `Jersey details for grade ${grade} and kit type ${kitType}`,
                data: jersey
            });
        }
        response.sendSuccess(res, {
            message: "Jersey list",
            data: Jerseys
        });
    }
    catch (error) {
        response.sendError(res, {
            message: error.message || "Failed to retrieve jersey list"
        });
    }
}

const getJerseyById = (req, res) => {
    try {
        const idJersey = Number(req.params.id);

        if (isNaN(idJersey)) {
            return response.sendErrorBadRequest(res, {
                message: "ID must be a number"
            });
        }
        
        const jersey = Jerseys.find((jersey) => jersey.id === idJersey);
        
        if (!jersey) {
            return response.sendErrorNotFound(res, {
                message: `Jersey with ID ${idJersey} not found`
            });
        }
        
        response.sendSuccess(res, {
            message: `Jersey details for ID: ${idJersey}`,
            data: jersey
        });
    }
    catch (error) {
        response.sendError(res, {
            message: error.message || `Failed to retrieve jersey with ID ${req.params.id}`
        });
    }
}

// const getJerseyByGradeAndKitType = (req, res) => {
//     try {
//         const grade = req.query.grade;
//         const kitType = req.query.kitType;

//         if (!grade || !kitType) {
//             return response.sendErrorBadRequest(res, {
//                 message: "Grade and kit type must be provided"
//             });
//         }

//         const jersey = Jerseys.filter((jersey) => jersey.Grade === grade && jersey["Kit Type"] === kitType);

//         if (!jersey) {
//             return response.sendErrorNotFound(res, {
//                 message: `Jersey with grade ${grade} and kit type ${kitType} not found`
//             });
//         }

//         response.sendSuccess(res, {
//             message: `Jersey details for grade ${grade} and kit type ${kitType}`,
//             data: jersey
//         });
//     }
//     catch (error) {
//         response.sendError(res, {
//             message: error.message || "Failed to retrieve jersey"
//         });
//     }
// }

export default { 
    getJerseyList, 
    getJerseyById,
};