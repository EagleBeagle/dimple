import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import joblib

X_test = joblib.load('preprocessed_data/X_test')
y_test = joblib.load('preprocessed_data/y_test')
y_test = [target for target in np.argmax(y_test, axis=1)]


# Egyszerű felépítésű konvolúciós model kiértékelése
simple_cnn_model = tf.keras.models.load_model('simple_cnn_model')
test_generator = ImageDataGenerator(rescale=1./255).flow(X_test)
simple_cnn_predictions = simple_cnn_model.predict(X_test, verbose=1)
simple_cnn_predictions = [prediction for prediction in np.argmax(simple_cnn_predictions, axis=1)]

# Inception V3 transfer learninget használó model kiértékelése
transer_learning_model = tf.keras.models.load_model('transfer_learning_model')
transfer_learning_predictions = transer_learning_model.predict(X_test, verbose=1)
transfer_learning_predictions = [prediction for prediction in np.argmax(transfer_learning_predictions, axis=1)]

print('Simple CNN Model')
print(classification_report(simple_cnn_predictions, y_test))
print(confusion_matrix(simple_cnn_predictions, y_test))
print('Accuracy:', accuracy_score(simple_cnn_predictions, y_test))
print('\n')
print('Transfer Learning with Inception V3')
print(classification_report(transfer_learning_predictions, y_test))
print(confusion_matrix(transfer_learning_predictions, y_test))
print('Accuracy:', accuracy_score(transfer_learning_predictions, y_test))
