import matplotlib.pyplot as plt
import joblib

history = joblib.load('simple_cnn_model/history')
plt.title('Simple CNN Model')
plt.plot(history['acc'])
plt.plot(history['val_acc'])
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train', 'Validation'], loc='upper left')
plt.show()

history = joblib.load('transfer_learning_model/history')
plt.title('Transfer Learning with Inception v3')
plt.plot(history['acc'])
plt.plot(history['val_acc'])
plt.ylabel('Accuracy')
plt.xlabel('Epoch')
plt.legend(['Train', 'Validation'], loc='upper left')
plt.show()
