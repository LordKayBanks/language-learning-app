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


def create_image_with_text(filename='example_image', questionText="Question",
                           answerText="Question", titleText="TitleText", size=12, color=(255, 255, 0), bg='red'):
    "Draw a text on an Image, saves it, show it"

    MAX_W, MAX_H = 800*2, 600
    im = Image.new('RGB', (MAX_W, MAX_H), "#006400")
    draw = ImageDraw.Draw(im)

    title = textwrap.wrap(titleText, width=60)
    main_paragraph = textwrap.wrap(answerText, width=60)
    translation_paragraph = textwrap.wrap(questionText, width=60)
    fontPath = '/usr/share/fonts/truetype/msttcorefonts/Arial.ttf'
    title_font = ImageFont.truetype(fontPath, 42)
    main_font = ImageFont.truetype(fontPath, 42)
    translation_font = ImageFont.truetype(fontPath, 32)

    title_h, title_pad = 100, 10
    main_h, main_pad = title_h+60, 10
    translation_h, translation_pad = main_h+200, 20
    for line in title:
        w, h = draw.textsize(line, font=title_font)
        draw.text(((MAX_W - w) / 2, title_h),
                  line, font=title_font, fill="#ffffff", stroke_width=2, stroke_fill='#000')
        title_h += h + title_pad
    for line in main_paragraph:
        w, h = draw.textsize(line, font=main_font)
        draw.text(((MAX_W - w) / 2, main_h),
                  line, font=main_font,  fill="#ff0", stroke_width=2, stroke_fill='#000')
        main_h += h + main_pad
    for line in translation_paragraph:
        w, h = draw.textsize(line, font=translation_font)
        draw.text(((MAX_W - w) / 2, translation_h),
                  line, font=translation_font, fill="#000")
        translation_h += h + translation_pad

    im.save(filename+".png")
    # im.show()


# questionText = "Python is great at many things, expecially for repetitive things."
# answerText = "Sie wissen das doch besser als ich. Sie wissen das doch besser als ich."
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
# asyncio.get_event_loop().run_until_complete(
#     textToMP3("How far are we going?", "/Users/kaybanks/Downloads/dict_files/_extra/output.mp3"))


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
            filename=picture_path+"--1.picture", questionText=questionText, answerText=answerText, titleText=word, size=300, bg=(153, 153, 255))
        asyncio.get_event_loop().run_until_complete(
            textToMP3(example['translation'], filename+"--1.question.mp3"))
        copyfile(os.path.join(full_path, item), os.path.join(
            foldername, item.replace('--', '--2.')))


def execute():
    language = 'de_en'
    folder_to_process = f'/Users/kaybanks/Downloads/dict_files/{language}_audio_files/'
    path_to_json_files = f'/Users/kaybanks/Downloads/dict_files/{language}_json/'
    dirs = [dir for dir in os.listdir(
        folder_to_process) if dir.startswith("folder_")]
    dirs = sorted(dirs)

    for counter, dir in enumerate(dirs):
        # counter = counter + 5  #  (5=offset) starting count of the process i.e de_en5.json, de_en6.json,...
        current_json_path = f'{path_to_json_files}/{language}{counter}.json'
        previous_json_path = f'{path_to_json_files}/{language}{counter-1}.json'
        full_path = os.path.join(folder_to_process, dir)

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
        print(
            f'done creating Images and translation audios!--{counter} of {folder_count}\n\n')


execute()
# await self._waiter
# aiohttp.client_exceptions.ClientOSError: [Errno 54] Connection reset by peer
