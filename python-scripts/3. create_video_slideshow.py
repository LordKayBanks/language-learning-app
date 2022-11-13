import os
import time
import re
from pydub import AudioSegment


def group_related_image_and_audio(folder_path):
    all_needed_files = []
    # [('001--1.picture.png', '001--2.final_audio_file.mp3'),('002--1.picture.png', '002--2.final_audio_file.mp3)]
    related_image_and_audio = {}
    for filename in os.listdir(folder_path):
        if (filename.endswith(".mp3") or filename.endswith(".png")):
            all_needed_files.append(filename)
    for file in all_needed_files:
        word_position_in_list, sentence = file.split("--")
        # 001--3.Du kannst das machen!
        if str(word_position_in_list) not in related_image_and_audio:
            related_image_and_audio[str(word_position_in_list)] = [file]
        else:
            current_value = related_image_and_audio[word_position_in_list]
            related_image_and_audio[str(word_position_in_list)] = [
                current_value[0], file]
    return sorted(related_image_and_audio.items())


# path = '/Users/kaybanks/Downloads/dict_files/de_en__Appfiles/Image_and_Joined_Audio'
# for x in group_related_image_and_audio(path):
#     print(x, "\n\n")


def create_video_from_image_and_audio():
    counter = 1
    input_folder_path = f'/Users/kaybanks/Downloads/dict_files/de_en__Appfiles/Image_and_Joined_Audio_{counter:02}/'
    output_folder_path = f'/Users/kaybanks/Downloads/dict_files/de_en__AppFiles/Videos_{counter:02}/'
    if not os.path.exists(output_folder_path):
        os.makedirs(output_folder_path)

    related_image_and_audio_list = group_related_image_and_audio(
        input_folder_path)

    for count, value in group_related_image_and_audio(
            input_folder_path):
        image, audio = sorted(value)
        image = f'\'{os.path.join(input_folder_path, image)}\''
        audio = f'\'{os.path.join(input_folder_path, audio)}\''

        output_filename = f'{str(count)}--video.mp4'
        output_filename = f'\'{os.path.join(output_folder_path, output_filename)}\''

        command = f'ffmpeg -hide_banner -loglevel error -loop 1 -i {image} -i {audio} -c:v libx264 -c:a copy -shortest {output_filename}'
        os.system(command)


create_video_from_image_and_audio()
# mma quick hit#
