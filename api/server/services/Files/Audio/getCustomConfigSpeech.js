const { logger } = require('~/config');
const getCustomConfig = require('~/server/services/Config/getCustomConfig');

/**
 * This function retrieves the speechTab settings from the custom configuration
 * It first fetches the custom configuration
 * Then, it checks if the custom configuration and the speechTab schema exist
 * If they do, it sends the speechTab settings as a JSON response
 * If they don't, it throws an error
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {Error} - If the custom configuration or the speechTab schema is missing, an error is thrown
 */
async function getCustomConfigSpeech(req, res) {
  try {
    const customConfig = await getCustomConfig();

    if (!customConfig || !customConfig.speech?.speechTab) {
      throw new Error('Configuration or speechTab schema is missing');
    }

    const ttsSchema = customConfig.speech?.speechTab;
    const settings = [];

    if (ttsSchema.advancedMode !== undefined) {
      settings.push({ advancedMode: ttsSchema.advancedMode });
    }
    if (ttsSchema.speechToText) {
      for (const key in ttsSchema.speechToText) {
        if (ttsSchema.speechToText[key] !== undefined) {
          settings.push({ [key]: ttsSchema.speechToText[key] });
        }
      }
    }
    if (ttsSchema.textToSpeech) {
      for (const key in ttsSchema.textToSpeech) {
        if (ttsSchema.textToSpeech[key] !== undefined) {
          settings.push({ [key]: ttsSchema.textToSpeech[key] });
        }
      }
    }

    console.log(settings);

    res.json(settings);
  } catch (error) {
    logger.error(`Failed to get speechTab settings: ${error.message}`);
    res.status(500).json({ error: 'Failed to get speechTab settings' });
  }
}

module.exports = getCustomConfigSpeech;
