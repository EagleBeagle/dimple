import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
import os
import random
from tqdm import tqdm
import joblib

train_dir = './raw_data/train'
test_dir = './raw_data/test'

categories = []
train_images = []
test_images = []
for category in os.listdir(train_dir):
  categories.append(category)
  train_images.extend([train_dir + '/' + category + '/{}'.format(i) for i in os.listdir(train_dir + '/' + category)])
mapping = {}

for category in os.listdir(test_dir):
  test_images.extend([test_dir + '/' + category + '/{}'.format(i) for i in os.listdir(test_dir + '/' + category)])

num_categories = []
for x in range(len(categories)):
  mapping[categories[x]] = x
for x in range(len(categories)):
  num_categories.append(mapping[categories[x]])
one_hot_encoded_categories = to_categorical(num_categories)

random.shuffle(train_images)

rows = 256
cols = 256

X = []
y = []

def read_and_process_images(images):
  X = []
  y = []

  for image in tqdm(images):
    X.append(cv2.resize(cv2.imread(image, cv2.IMREAD_COLOR), (rows, cols), interpolation=cv2.INTER_CUBIC))
    for category in categories:
      if category in image:
        y.append(one_hot_encoded_categories[mapping[category]])
        break
  
  X = np.array(X)
  y = np.array(y)
  return X, y

print('Processing train images')
X, y = read_and_process_images(train_images)
print('Processing test images')
X_test, y_test = read_and_process_images(test_images)

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.20, random_state=2)

joblib.dump(X_train, 'preprocessed_data/X_train')
joblib.dump(X_val, 'preprocessed_data/X_val')
joblib.dump(y_train, 'preprocessed_data/y_train')
joblib.dump(y_val, 'preprocessed_data/y_val')
joblib.dump(X_test, 'preprocessed_data/X_test')
joblib.dump(y_test, 'preprocessed_data/y_test')

print('Preprocessed images saved')
