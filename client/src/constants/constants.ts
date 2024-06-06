type Constants = {
  [key: string]: string
}

const constants: Constants = {
  chatModel: 'gpt-3.5-turbo',
  imageModel: 'dall-e-3',
  numberOfImages: '1',
  chatGPTPrompt:
    'I will provide you with 5 random words, and I would like you to write me ' +
    'a short tale out of those 5 words. It should be between 200 and 300 words, ' +
    'and it should be something clever and nice, suitable for small kids to enjoy ' +
    'before bedtime. Give it a fitting title as well, in the form "Title: ". Use a ' +
    'single line break to separate the title from the tale, and also to create 3 ' +
    'parts in the tale.',
  dallEPrompt:
    'Now create two prompts for DALL-E to illustrate your tale.' +
    'Do not use names from your tale in the prompts.' +
    'Your answer should be formatted like: prompt1: the first prompt, prompt2: the second prompt',
  networkErrorTitle: 'Network request error.',
  networkErrorMessage:
    'Something went wrong when trying to generate your tale. Please check your connection and try again.',
  imageRequestErrorMessage: 'Something went wrong when trying to generate images for your tale.',
  inputInfoMessage: 'Please add 5 keywords of your choice or choose from the provided list.',
  duplicateWordWarning: 'You already have that word selected.',
  maximumKeywordsReachedWarning: 'You can only use 5 keywords to generate your tale.',
  taleStorageKey: 'tale',
  imagesStorageKey: 'illustration',
  pagesStorageKey: 'pages',
  randomWordsStorageKey: 'random',
  createdAtStorageKey: 'createdAt',
  taleIsLoadingText: 'Your tale is being written.',
  imageIsLoadingText: 'Illustrations are being painted.',
  dallEImageValidTime: '50',
  imageIndexes: '1,3',
}

export default constants
