from PIL import Image, ImageDraw, ImageFont
from shutil import copyfile
import os
import textwrap
import asyncio
import edge_tts
import json
# import bigjson


def find_substring_in_obj(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s['text']:
            return s
    return False


def create_image_with_text(filename='example_image', questionText="Question", answerText="Question",
                           size=12, color=(255, 255, 0), bg='red'):
    "Draw a text on an Image, saves it, show it"

    para = textwrap.wrap(questionText, width=60)
    para2 = textwrap.wrap(answerText, width=60)

    MAX_W, MAX_H = 600*2, 600
    im = Image.new('RGB', (MAX_W, MAX_H), "green")
    draw = ImageDraw.Draw(im)
    fontPath = '/usr/share/fonts/truetype/msttcorefonts/Arial.ttf'
    font = ImageFont.truetype(fontPath, 24)
    font2 = ImageFont.truetype(fontPath, 32)

    current_h, pad = 100, 10
    for line in para:
        w, h = draw.textsize(line, font=font)
        draw.text(((MAX_W - w) / 2, current_h), line, font=font)
        current_h += h + pad
    current_h2, pad2 = current_h+50, 20
    for line2 in para2:
        w, h = draw.textsize(line2, font=font2)
        draw.text(((MAX_W - w) / 2, current_h2), line2, font=font2)
        current_h2 += h + pad2

    im.save(filename+".png")
    # im.show()

# questionText = "Python is great at many things, expecially for repetitive things."
# answerText = "Sie wissen das doch besser als ich."
# create_image_with_text(questionText=questionText,
#                        answerText=answerText, size=300, bg=(153, 153, 255))


async def textToMP3(text: str, file_path: str):
    folder_path = os.path.dirname(file_path)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    communicate = edge_tts.Communicate()
    with open(file_path, "wb") as fileObject:
        async for i in communicate.run(text):
            if i[2] is not None:
                fileObject.write(i[2])
asyncio.get_event_loop().run_until_complete(
    textToMP3("How far are we going?", "/Users/kaybanks/Downloads/dict_files/_extra/output.mp3"))


def create_app_mediafiles(current_data, previous_data, full_path, counter, language):
    output_folder_path = f'/Users/kaybanks/Downloads/dict_files/de_en__AppFiles/Image_and_Joined_Audio_{counter:02}/'
    if not os.path.exists(output_folder_path):
        os.makedirs(output_folder_path)
    audio_files_list = [audioFile for current_folder_path,
                        audio_folder, audioFile in os.walk(full_path)][0]
    audio_files_list = [
        filename for filename in audio_files_list if not filename.startswith('.')]
    audio_files_list.sort()
    # ===================================
    for item in audio_files_list:
        word_position_in_list__word, sentence = item.split("--")
        word_position_in_list, word = word_position_in_list__word.split(
            ". ")
        sentence = sentence.split(".mp3")[0]
        # ===================================
        try:
            examples = current_data[word]
        except KeyError:
            print(KeyError)
            examples = previous_data[word]
        example = find_substring_in_obj(examples, sentence)
        if example is False:
            continue
        path_to_app_files = f'/Users/kaybanks/Downloads/dict_files/{language}__AppFiles/'
        foldername = f'{path_to_app_files}Audio_{counter:02}/'
        if not os.path.exists(foldername):
            os.makedirs(foldername)
        filename = f'{foldername}{word_position_in_list}. {word}'
        # picture_path = f'{output_folder_path}{word_position_in_list}.{word}'
        picture_path = f'{output_folder_path}{word_position_in_list}'
        questionText = example['translation']
        answerText = example['text']
        create_image_with_text(
            filename=picture_path+"--1.picture", questionText=questionText, answerText=answerText, size=300, bg=(153, 153, 255))
        asyncio.get_event_loop().run_until_complete(
            textToMP3(example['translation'], filename+"--1.question.mp3"))
        copyfile(os.path.join(full_path, item), os.path.join(
            foldername, item.replace('--', '--2.')))


def execute():
    counter = 0  # starting point of the process i.e the json file to start with
    parent_folder = "/Users/kaybanks/Downloads/dict_files/de_en_audio_files"
    language = 'de_en'
    for root, dirs, files in os.walk(parent_folder):
        dirs[:] = [dir for dir in dirs if not dir.startswith('.')]
        sortedList = sorted(dirs)
        for dir in sortedList[counter:]:
            current_json_path = f'/Users/kaybanks/Repository/language-study-webpack/de_en_json/de_en{counter}.json'
            previous_json_path = f'/Users/kaybanks/Repository/language-study-webpack/de_en_json/de_en{counter-1}.json'
            full_path = os.path.join(root, dir)

            current_json_file = open(current_json_path)
            current_data = json.load(current_json_file)
            current_json_file.close()
            previous_data = None
            try:
                previous_json_file = open(previous_json_path)
                previous_data = json.load(previous_json_file)
                previous_json_file.close()
            except FileNotFoundError:
                print(FileNotFoundError)

            create_app_mediafiles(
                current_data, previous_data, full_path, counter, language)
            counter = counter+1


# execute()
# await self._waiter
# aiohttp.client_exceptions.ClientOSError: [Errno 54] Connection reset by peer
