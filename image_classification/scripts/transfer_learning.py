
from tensorflow.keras import layers
from tensorflow.keras import models
from tensorflow.keras.applications import InceptionV3
import joblib

print('Loading data...')
X_train = joblib.load('preprocessed_data/X_train')
y_train = joblib.load('preprocessed_data/y_train')
X_val = joblib.load('preprocessed_data/X_val')
y_val = joblib.load('preprocessed_data/y_val')
print('Data loaded successfully')

inceptionv3 = InceptionV3(include_top=False, weights='imagenet', input_shape=(256, 256, 3))

for layer in inceptionv3.layers:
  if isinstance(layer, layers.BatchNormalization):
    layer.trainable = True
  else:
    layer.trainable = False

model = models.Sequential()
model.add(inceptionv3)
model.add(layers.GlobalAveragePooling2D())
model.add(layers.Dropout(0.5))
model.add(layers.Dense(14, activation='sigmoid'))

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['acc'])

history = model.fit(x=X_train, y=y_train, epochs=25, validation_data=(X_val, y_val))

model.save('transfer_learning_model')
joblib.dump(history.history, 'transfer_learning_model/history')
