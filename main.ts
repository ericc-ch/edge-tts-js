import { connectId } from "./utils.ts";

interface OptionsTTS {
  text: string;
  voice: string;
  rate: string;
  volume: string;
  pitch: string;
}

function generateSSML({
  text,
  voice,
  rate,
  volume,
  pitch,
}: OptionsTTS): string {
  return `
    <speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
      <voice name='${voice}'>
        <prosody pitch='${pitch}' rate='${rate}' volume='${volume}'>
          ${text}
        </prosody>
      </voice>
    </speak>
  `;
}

interface OptionsSSMLHeadersPlusData {
  requestId: string;
  timestamp: string;
  ssml: string;
}

/**
 * Returns the headers and data to be used in the request.
 */
function ssmlHeadersPlusData({
  requestId,
  ssml,
  timestamp,
}: OptionsSSMLHeadersPlusData): string {
  return (
    `X-RequestId: ${requestId}\r\n` +
    `Content-Type: application/ssml+xml\r\n` +
    `X-Timestamp: ${timestamp}Z\r\n` + // This is not a mistake, Microsoft Edge bug.
    `Path: ssml\r\n\r\n` +
    `${ssml}`
  );
}

function getMaxMessageSize({ voice, rate, volume, pitch }: OptionsTTS): number {
  const websocketMaxSize = 2 ** 16;
  const overheadPerMessage =
    ssmlHeadersPlusData({
      requestId: connectId(),
      timestamp: new Date().toString(),
      ssml: generateSSML({ voice, rate, volume, pitch, text: "" }),
    }).length + 50; // Margin of error

  return Math.max(0, websocketMaxSize - overheadPerMessage); // Ensure non-negative size
}

/* 
Escape &, <, and > in a string of data.
  
  You can escape other strings of data by passing a map as
  the optional entities parameter. Each key will be replaced
  with its corresponding value.
  */
function escape(
  data: string,
  entities: Map<string, string> = new Map()
): string {
  const escapeMap = new Map([
    ["&", "&amp;"],
    [">", "&gt;"],
    ["<", "&lt;"],
  ]);

  // Merge the provided entities with the default escape map
  entities.forEach((value, key) => escapeMap.set(key, value));

  escapeMap.forEach((value, key) => {
    data = data.replaceAll(key, value);
  });

  return data;
}
