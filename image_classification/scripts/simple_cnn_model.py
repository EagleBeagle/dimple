from tensorflow.keras import layers
from tensorflow.keras import models
import joblib

print('Loading data...')
X_train = joblib.load('preprocessed_data/X_train')
y_train = joblib.load('preprocessed_data/y_train')
X_val = joblib.load('preprocessed_data/X_val')
y_val = joblib.load('preprocessed_data/y_val')
print('Data loaded successfully')

model = models.Sequential()
model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(256, 256, 3)))
model.add(layers.BatchNormalization())
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Dropout(0.2))
model.add(layers.Conv2D(64, (3, 3), activation='relu'))
model.add(layers.BatchNormalization())
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Dropout(0.3))
model.add(layers.Conv2D(128, (3, 3), activation='relu'))
model.add(layers.BatchNormalization())
model.add(layers.MaxPooling2D((2, 2)))
model.add(layers.Dropout(0.4))
model.add(layers.Flatten())
model.add(layers.Dense(128, activation='relu'))
model.add(layers.BatchNormalization())
model.add(layers.Dropout(0.5))
model.add(layers.Dense(14, activation='sigmoid'))

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['acc'])

history = model.fit(x=X_train, y=y_train, epochs=25, validation_data=(X_val, y_val))

model.save('simple_cnn_model')
joblib.dump(history.history, 'simple_cnn_model/history')
