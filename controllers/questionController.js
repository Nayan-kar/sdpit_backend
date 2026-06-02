const Question =
  require("../models/Question");

// ======================================
// DELETE QUESTION
// ======================================

const deleteQuestion = async (

  req,

  res

) => {

  try {

    const { id } = req.params;

    const question =
      await Question.findById(id);

    if (!question) {

      return res.status(404).json({

        success: false,

        message:
          "Question not found"

      });

    }

    await Question.findByIdAndDelete(
      id
    );

    res.status(200).json({

      success: true,

      message:
        "Question deleted successfully"

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to delete question"

    });

  }

};

// ======================================
// EXPORTS
// ======================================

module.exports = {

  deleteQuestion

};