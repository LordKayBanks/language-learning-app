import os
import time
import re
from pydub import AudioSegment


class cd:
    """Context manager for changing the current working directory"""

    def __init__(self, newPath):
        self.newPath = os.path.expanduser(newPath)

    def __enter__(self):
        self.savedPath = os.getcwd()
        os.chdir(self.newPath)

    def __exit__(self, etype, value, traceback):
        os.chdir(self.savedPath)
# with cd(input_folder_path):
#     new_file = open("temp.txt", "w")
#     new_file.write(f'file {question}\nfile {answer}')
#     command = f'ffmpeg -hide_banner -loglevel error -f concat -safe 0 -i temp.txt -c copy {output_filename}'
#     os.system(command)


def get_valid_filename(filename: str):
    filename = str(filename).strip().replace(' ', '_')
    return re.sub(r'(?u)[^-\w.]', '', filename)


def group_related_audio_files(folder_path):
    audio_files = []
    # [('000._der--#question.mp3', '000._der--Du kannst das machen!.mp3'),('001. der--#question.mp3', '001. der--Was ist das da?.mp3')]
    related_audio_files = {}
    for filename in os.listdir(folder_path):
        if (filename.endswith(".mp3")):
            audio_files.append(filename)
    for file in audio_files:
        word_position_in_list__word, sentence = file.split("--")
        word_position_in_list, word = word_position_in_list__word.split(
            "._")  # 001._der--3.Du kannst das machen!
        if str(word_position_in_list) not in related_audio_files:
            related_audio_files[str(word_position_in_list)] = [file]
        else:
            question = related_audio_files[word_position_in_list]
            related_audio_files[str(word_position_in_list)] = [
                question[0], file]
    # print(related_audio_files)
    return related_audio_files

# path = '/Users/kaybanks/Downloads/dict_files/de_en_app_files/Audio_00'
# group_related_audio_files(path)


def rename_invalid_filenames(folder_path):
    for filename in os.listdir(folder_path):
        potential_filename = get_valid_filename(filename)
        if (filename != potential_filename):
            os.rename(os.path.join(folder_path,  filename),
                      os.path.join(folder_path, potential_filename))
            # print(filename, " : ", potential_filename, '\n\n')


def merge_related_audio_files(counter):
    parent_path = '/Users/kaybanks/Downloads/dict_files/de_en__AppFiles/'
    input_folder_path = f'{parent_path}/Audio_{counter:02}/'
    output_folder_path = f'{parent_path}/Image_and_Joined_Audio_{counter:02}/'
    rename_invalid_filenames(input_folder_path)

    if not os.path.exists(output_folder_path):
        os.makedirs(output_folder_path)
    related_audio_files_list = group_related_audio_files(
        input_folder_path).items()
    related_audio_files_list = sorted(related_audio_files_list)

    for key, value in related_audio_files_list:
        value = sorted(value)
        question, answer = value

        question = f'{os.path.join(input_folder_path, question)}'
        answer = f'{os.path.join(input_folder_path, answer)}'
        output_filename = f'{str(key)}--2.final_audio_file.mp3'
        output_filename = f'{os.path.join(output_folder_path, output_filename)}'

        silent_duration = 2 * 1000
        gap = AudioSegment.silent(duration=silent_duration)
        question_part = AudioSegment.from_mp3(question)
        answer_part = AudioSegment.from_mp3(answer)
        combined_question_answer = question_part + gap + answer_part
        combined_question_answer.export(output_filename, format="mp3")

# merge_related_audio_files(0)


def execute():
    folder_to_process = "/Users/kaybanks/Downloads/dict_files/de_en__AppFiles"
    audio_dirs = [dir for dir in os.listdir(
        folder_to_process) if dir.startswith("Audio_")]
    # audio_dirs = sorted(audio_dirs)
    folder_count = len(audio_dirs)
    for counter in range(folder_count):
        merge_related_audio_files(counter)
        print(
            f'done combining question and answer audios!--{counter} of {folder_count}\n\n')


execute()

# command = f'ffmpeg -hide_banner -loglevel error -f concat -safe 0 -i {input_text_file} -c copy {output_filename}'
# ffmpeg -f concat -i input.txt -c copy output.mp3

# create mp4 from mp3 and png files
# ffmpeg -loop 1 -i '629. doch--#picture.png' -i '629. doch--Doch, doch, ich sehe es auch so..mp3' -c:v libx264 -c:a copy -shortest out.mp4

# create silent 2 second mp3 file
# ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 2 -q:a 9 -acodec libmp3lame out.mp3
