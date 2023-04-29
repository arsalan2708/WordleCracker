wordList = list()
with open('words.txt') as file:
    for line in file:
        wordList.append(line.strip().lower())

output = 'words = ['
for w,i in zip(wordList, range(len(wordList)-1)) :
    output+= f''' "{w}", '''

output+= f''' "{wordList[-1]}" ]'''

with open('../words.js', 'w') as jsFile:
    jsFile.write(output)
